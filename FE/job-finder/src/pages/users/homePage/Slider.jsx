import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import slide1 from "../../../assets/imgs/slider/1-C1-346x 577.jpg";
import slide2 from "../../../assets/imgs/slider/2gyH1LpC8bLUG0QR25zRSXUXcwF3Y708_1764122663____3786af902aa7c3605e590a70c0cb627d.jpg";
import slide3 from "../../../assets/imgs/slider/L5gkmxixp5e4PlBqokGW3g8vszsKrTlv_1762482629____a10bf97e5dee3b963cfee4efe80a62ff.jpg";
import slide4 from "../../../assets/imgs/slider/TVnpgZWx1HYB8oYtH752ik4XzqiLK3Ox_1762313595____e5c96573100245d7018db8c84e3bad88.jpg";
import slide5 from "../../../assets/imgs/slider/ZJP4012fi6vfrZMbCg3tzTWJMQ5sTVdx_1762928768____75140ea509ddf04f1c49593951e54082.jpg";
import slide6 from "../../../assets/imgs/slider/ny2L12gRdsw7mLAy1YUJPD0TvA8vaQoZ_1763608777____aaede1117986ab92f58f86ee78b9f482.jpg";
import slide7 from "../../../assets/imgs/slider/wsNPsf7gWyWQTEw3ULM89YargIz1JyY4_1763613452____15695fa2f265ae554b8f329ae0e105da.jpg";
import slide8 from "../../../assets/imgs/slider/xZJggbFfJTZY52Mu8QSQ6juZLQ4EeNn3_1763348374____66d057f09d67ff3dbed1e2298802929b.jpg";
import "./Slider.scss";

export default function Slider() {
  const images = [
    { src: slide1, link: "/promo/1" },
    { src: slide2, link: "/promo/2" },
    { src: slide3, link: "/promo/3" },
    { src: slide4, link: "/promo/4" },
    { src: slide5, link: "/promo/5" },
    { src: slide6, link: "/promo/6" },
    { src: slide7, link: "/promo/7" },
    { src: slide8, link: "/promo/8" },
  ];

  const [index, setIndex] = useState(0);
  const itemsToShow = 3; // Cấu hình số ảnh hiện cùng lúc

  const maxIndex = images.length - itemsToShow;

  const nextSlide = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); 
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="slider-container">
      <button className="slider-btn prev" onClick={prevSlide}>
        &#10094;
      </button>

      <div 
        className="slider" 
        style={{ transform: `translateX(-${index * (100 / itemsToShow)}%)` }}
      >
        {images.map((img, i) => (
          <div className="slide" key={i}>
            <Link to={img.link}>
              <img src={img.src} alt="" />
            </Link>
          </div>
        ))}
      </div>

      <button className="slider-btn next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}