"""
CV AI Service - Python Flask
Tích hợp: Google Gemini API
Chức năng:
  - POST /api/process-cv    → Phân tích CV + gợi ý nội dung + gợi ý kỹ năng còn thiếu
  - POST /api/generate-pdf  → Tạo file PDF CV từ dữ liệu người dùng gửi lên
  - GET  /health            → Kiểm tra service

Cài đặt:
    pip install flask google-generativeai reportlab

Biến môi trường cần set:
    GEMINI_API_KEY=AIza...
"""

import os
import io
import re
import json
import base64
from flask import Flask, request, jsonify

import google.generativeai as genai

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    HRFlowable, Table, TableStyle
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ── Khởi tạo ──────────────────────────────────────────────────────────────────
app = Flask(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("[CẢNH BÁO] Chưa set GEMINI_API_KEY!")

# ── Helper: Gọi Gemini ─────────────────────────────────────────────────────────
def call_gemini(prompt: str, max_tokens: int = 2048) -> str:
    """Gọi Gemini và trả về text thuần."""
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=max_tokens,
            temperature=0.4,
        )
    )
    response = model.generate_content(prompt)
    return response.text.strip()


def extract_json(raw: str) -> dict:
    """Loại bỏ markdown fence rồi parse JSON."""
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


# ── Helper: Tạo PDF CV ─────────────────────────────────────────────────────────
def build_cv_pdf(cv_data: dict, ai_suggestions: dict) -> bytes:
    """
    Tạo file PDF CV chuyên nghiệp từ cv_data và gợi ý AI.
    Trả về bytes của file PDF.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
    )

    # ── Màu sắc chủ đạo ──
    PRIMARY    = colors.HexColor("#1a3c5e")   # xanh đậm
    ACCENT     = colors.HexColor("#2e86c1")   # xanh nhạt
    LIGHT_GRAY = colors.HexColor("#f2f4f6")
    TEXT_GRAY  = colors.HexColor("#555555")

    # ── Style ──
    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        "NameStyle",
        fontName="Helvetica-Bold",
        fontSize=22,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=2,
    )
    contact_style = ParagraphStyle(
        "ContactStyle",
        fontName="Helvetica",
        fontSize=9,
        textColor=TEXT_GRAY,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    section_title_style = ParagraphStyle(
        "SectionTitle",
        fontName="Helvetica-Bold",
        fontSize=11,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=3,
    )
    body_style = ParagraphStyle(
        "BodyStyle",
        fontName="Helvetica",
        fontSize=9.5,
        textColor=colors.HexColor("#333333"),
        leading=14,
        spaceAfter=3,
    )
    bullet_style = ParagraphStyle(
        "BulletStyle",
        fontName="Helvetica",
        fontSize=9.5,
        textColor=colors.HexColor("#333333"),
        leading=14,
        leftIndent=12,
        spaceAfter=2,
        bulletIndent=4,
    )
    job_title_style = ParagraphStyle(
        "JobTitle",
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=PRIMARY,
        spaceAfter=1,
    )
    company_style = ParagraphStyle(
        "CompanyStyle",
        fontName="Helvetica-Oblique",
        fontSize=9,
        textColor=ACCENT,
        spaceAfter=2,
    )

    story = []

    # ── Header: Tên + thông tin liên lạc ──
    full_name   = cv_data.get("fullName", "")
    email       = cv_data.get("email", "")
    phone       = cv_data.get("phone", "")
    address     = cv_data.get("address", "")
    target_role = cv_data.get("targetRole", "")
    linkedin    = cv_data.get("linkedin", "")

    story.append(Paragraph(full_name.upper(), name_style))
    if target_role:
        story.append(Paragraph(target_role, ParagraphStyle(
            "RoleStyle", fontName="Helvetica",
            fontSize=11, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=4
        )))

    contact_parts = [x for x in [email, phone, address, linkedin] if x]
    if contact_parts:
        story.append(Paragraph("  |  ".join(contact_parts), contact_style))

    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=8))

    def section_header(title):
        story.append(Paragraph(title.upper(), section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=ACCENT, spaceAfter=5))

    # ── Tóm tắt (dùng bản cải thiện từ AI nếu có) ──
    improved_summary = ai_suggestions.get("improved_summary", "")
    original_summary = cv_data.get("summary", "")
    summary_text = improved_summary or original_summary

    if summary_text:
        section_header("Giới thiệu bản thân")
        story.append(Paragraph(summary_text, body_style))

    # ── Kinh nghiệm làm việc ──
    experience = cv_data.get("experience", [])
    if experience:
        section_header("Kinh nghiệm làm việc")
        for exp in experience:
            role    = exp.get("role", exp.get("title", ""))
            company = exp.get("company", "")
            period  = exp.get("period", exp.get("years", ""))
            desc    = exp.get("description", "")

            header_data = [[
                Paragraph(role, job_title_style),
                Paragraph(str(period), ParagraphStyle(
                    "PeriodStyle", fontName="Helvetica",
                    fontSize=9, textColor=TEXT_GRAY,
                    alignment=TA_LEFT
                ))
            ]]
            t = Table(header_data, colWidths=["75%", "25%"])
            t.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
            ]))
            story.append(t)
            if company:
                story.append(Paragraph(company, company_style))
            if desc:
                for line in desc.split("\n"):
                    line = line.strip()
                    if line:
                        story.append(Paragraph(f"• {line}", bullet_style))
            story.append(Spacer(1, 4))

    # ── Học vấn ──
    education = cv_data.get("education", [])
    if education:
        section_header("Học vấn")
        for edu in education:
            degree  = edu.get("degree", "")
            school  = edu.get("school", edu.get("institution", ""))
            period  = edu.get("period", edu.get("year", ""))
            gpa     = edu.get("gpa", "")

            edu_text = f"<b>{degree}</b>"
            if school:
                edu_text += f" — {school}"
            if gpa:
                edu_text += f"  <i>(GPA: {gpa})</i>"

            row_data = [[
                Paragraph(edu_text, body_style),
                Paragraph(str(period), ParagraphStyle(
                    "P2", fontName="Helvetica", fontSize=9,
                    textColor=TEXT_GRAY, alignment=TA_LEFT
                ))
            ]]
            t = Table(row_data, colWidths=["75%", "25%"])
            t.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
            ]))
            story.append(t)

    # ── Kỹ năng ──
    skills = cv_data.get("skills", [])
    if skills:
        section_header("Kỹ năng")
        # Chia thành 2 cột
        half = (len(skills) + 1) // 2
        col1 = skills[:half]
        col2 = skills[half:]
        max_rows = max(len(col1), len(col2))
        skill_data = []
        for i in range(max_rows):
            s1 = f"• {col1[i]}" if i < len(col1) else ""
            s2 = f"• {col2[i]}" if i < len(col2) else ""
            skill_data.append([
                Paragraph(s1, body_style),
                Paragraph(s2, body_style),
            ])
        skill_table = Table(skill_data, colWidths=["50%", "50%"])
        skill_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 1),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ]))
        story.append(skill_table)

    # ── Chứng chỉ ──
    certifications = cv_data.get("certifications", [])
    if certifications:
        section_header("Chứng chỉ")
        for cert in certifications:
            story.append(Paragraph(f"• {cert}", bullet_style))

    # ── Gợi ý kỹ năng còn thiếu (phần AI bổ sung) ──
    missing_skills = ai_suggestions.get("missing_skills", [])
    if missing_skills:
        section_header("Kỹ năng nên bổ sung (gợi ý AI)")
        for item in missing_skills:
            skill_name = item.get("skill", "")
            importance = item.get("importance", "")
            reason     = item.get("reason", "")
            label_color = "#c0392b" if importance == "Cao" else "#e67e22" if importance == "Trung bình" else "#27ae60"
            line = f'<b>{skill_name}</b> <font color="{label_color}">[{importance}]</font>'
            if reason:
                line += f" — {reason}"
            story.append(Paragraph(line, bullet_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTE 1: Phân tích CV đầy đủ bằng Gemini
# ═══════════════════════════════════════════════════════════════════════════════
@app.route('/api/process-cv', methods=['POST'])
def process_cv():
    """
    Body JSON:
    {
      "fullName": "Nguyễn Văn A",
      "email": "a@email.com",
      "phone": "0901234567",
      "targetRole": "Backend Developer",
      "summary": "...",
      "skills": ["Python", "SQL"],
      "experience": [{"role": "Dev", "company": "FPT", "period": "2022-2024", "description": "..."}],
      "education": [{"degree": "Kỹ sư CNTT", "school": "ĐH Bách Khoa", "period": "2018-2022"}],
      "certifications": ["AWS Cloud Practitioner"]
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Thiếu dữ liệu!"}), 400

        full_name   = data.get("fullName", "N/A")
        target_role = data.get("targetRole", "chưa xác định")
        skills      = data.get("skills", [])
        experience  = data.get("experience", [])
        education   = data.get("education", [])
        summary     = data.get("summary", "")
        certs       = data.get("certifications", [])

        print(f"[INFO] Đang xử lý CV: {full_name} → {target_role}")

        prompt = f"""
Bạn là chuyên gia tư vấn tuyển dụng và viết CV hàng đầu tại Việt Nam.
Phân tích CV bên dưới và trả về KẾT QUẢ JSON THUẦN TÚY (không markdown, không code fence).

=== THÔNG TIN CV ===
Họ tên: {full_name}
Vị trí ứng tuyển: {target_role}
Tóm tắt: {summary or "Chưa có"}
Kỹ năng: {", ".join(skills) or "Chưa có"}
Kinh nghiệm: {json.dumps(experience, ensure_ascii=False)}
Học vấn: {json.dumps(education, ensure_ascii=False)}
Chứng chỉ: {", ".join(certs) or "Chưa có"}

=== TRẢ VỀ JSON với cấu trúc sau ===
{{
  "cv_score": <0-100>,
  "improved_summary": "<Viết lại phần giới thiệu bản thân chuyên nghiệp hơn, 3-4 câu tiếng Việt>",
  "content_suggestions": [
    {{"section": "<tên phần>", "suggestion": "<gợi ý cụ thể>"}}
  ],
  "missing_skills": [
    {{"skill": "<tên>", "importance": "<Cao|Trung bình|Thấp>", "reason": "<lý do>"}}
  ],
  "strengths": ["<điểm mạnh>"],
  "overall_feedback": "<nhận xét tổng thể 2-3 câu>"
}}
"""
        raw = call_gemini(prompt, max_tokens=2000)
        analysis = extract_json(raw)

        return jsonify({
            "status": "success",
            "candidate": {
                "name": full_name,
                "email": data.get("email", ""),
                "targetRole": target_role,
            },
            "analysis": analysis
        }), 200

    except json.JSONDecodeError as e:
        return jsonify({"status": "error", "message": f"Gemini trả về JSON lỗi: {e}"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTE 2: Tạo PDF CV
# ═══════════════════════════════════════════════════════════════════════════════
@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    """
    Body JSON: cùng format với /api/process-cv
    Response: { "status": "success", "pdf_base64": "<base64>", "filename": "CV_NguyenVanA.pdf" }
    ASP.NET Core nhận base64 → decode → trả file về cho React
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Thiếu dữ liệu!"}), 400

        full_name   = data.get("fullName", "Ung_Vien")
        target_role = data.get("targetRole", "")

        print(f"[INFO] Đang tạo PDF CV cho: {full_name}")

        # Bước 1: Gọi Gemini lấy gợi ý nội dung + kỹ năng còn thiếu
        skills     = data.get("skills", [])
        experience = data.get("experience", [])
        summary    = data.get("summary", "")
        certs      = data.get("certifications", [])

        prompt = f"""
Viết lại phần giới thiệu bản thân và gợi ý kỹ năng còn thiếu cho CV sau.
Trả về JSON THUẦN TÚY:
{{
  "improved_summary": "<3-4 câu tiếng Việt chuyên nghiệp>",
  "missing_skills": [
    {{"skill": "<tên>", "importance": "<Cao|Trung bình|Thấp>", "reason": "<lý do ngắn gọn>"}}
  ]
}}

Vị trí ứng tuyển: {target_role or "chưa xác định"}
Tóm tắt hiện tại: {summary or "Chưa có"}
Kỹ năng: {", ".join(skills) or "Chưa có"}
Kinh nghiệm (entries): {len(experience)} mục
Chứng chỉ: {", ".join(certs) or "Chưa có"}
"""
        raw = call_gemini(prompt, max_tokens=800)
        ai_suggestions = extract_json(raw)

        # Bước 2: Tạo PDF
        pdf_bytes = build_cv_pdf(data, ai_suggestions)

        # Bước 3: Encode base64 để gửi qua HTTP
        pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")

        safe_name = re.sub(r"[^\w\-]", "_", full_name)
        filename = f"CV_{safe_name}.pdf"

        return jsonify({
            "status": "success",
            "filename": filename,
            "pdf_base64": pdf_b64,
            "message": f"Đã tạo PDF CV cho {full_name} thành công!"
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
# ROUTE 3: Health check
# ═══════════════════════════════════════════════════════════════════════════════
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "CV AI Service",
        "ai_provider": "Google Gemini",
        "gemini_key_set": bool(GEMINI_API_KEY)
    }), 200


# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print("=" * 60)
    print("  CV AI Service (Gemini) đang chạy...")
    print("  URL: http://127.0.0.1:5000")
    print()
    print("  Routes:")
    print("  POST /api/process-cv   → Phân tích CV + gợi ý")
    print("  POST /api/generate-pdf → Tạo file PDF CV")
    print("  GET  /health           → Health check")
    print()
    print("  Đảm bảo đã set: GEMINI_API_KEY=AIza...")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=True)