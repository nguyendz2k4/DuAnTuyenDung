import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import MultiSelect from "../MultiSelect";

export default function SelectInputs({ onChange }) {
  const [selectedData, setSelectedData] = useState({
    workType: "",
    education: "",
    positions: [],
  });

  const options = [
    { value: "Full time", label: "Full time" },
    { value: "Part time", label: "Part time" },
    { value: "4-6 tiếng", label: "4-6 tiếng" },
  ];

  const options_education = [
    { value: "Đại học", label: "Đại học" },
    { value: "Cao đẳng", label: "Cao đẳng" },
    { value: "Trung cấp", label: "Trung cấp" },
    { value: "Khác", label: "Khác" },
  ];

  const multiOptions = [
    { value: "Nhân viên", text: "Nhân viên" },
    { value: "Trưởng phòng", text: "Trưởng phòng" },
    { value: "Quản lý", text: "Quản lý" },
    { value: "Nhân sự", text: "Nhân sự" },
  ];

  const handleChange = (key, value) => {
    const updated = { ...selectedData, [key]: value };
    setSelectedData(updated);
    onChange(updated);
  };

  return (
    <ComponentCard title="Thông tin bổ sung">
      <div className="space-y-6">
        <div>
          <Label>Hình thức làm việc</Label>
          <Select
            options={options}
            placeholder="Chọn hình thức làm việc"
            onChange={(value) => handleChange("workType", value)}
          />
        </div>

        <div>
          <Label>Yêu cầu học vấn</Label>
          <Select
            options={options_education}
            placeholder="Chọn học vấn"
            onChange={(value) => handleChange("education", value)}
          />
        </div>

        <div>
          <MultiSelect
            label="Cấp bậc"
            className="position"
            options={multiOptions}
            onChange={(values) => handleChange("positions", values)}
          />
          <p className="text-sm text-gray-500 mt-1">
            {selectedData.positions.join(", ") || "Chưa chọn cấp bậc nào"}
          </p>
        </div>
      </div>
    </ComponentCard>
  );
}
