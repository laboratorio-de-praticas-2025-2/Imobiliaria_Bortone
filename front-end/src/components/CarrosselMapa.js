"use client";
import { useRef, useState, useEffect } from "react";
import Card from "./CardMapa";

export default function CarrosselMapa({ imoveis }) {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos(
      isMobile
        ? e.pageY - carouselRef.current.offsetTop
        : e.pageX - carouselRef.current.offsetLeft
    );
    setScrollStart(
      isMobile ? carouselRef.current.scrollTop : carouselRef.current.scrollLeft
    );
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const pos = isMobile
      ? e.pageY - carouselRef.current.offsetTop
      : e.pageX - carouselRef.current.offsetLeft;
    const walk = pos - startPos;
    if (isMobile) {
      carouselRef.current.scrollTop = scrollStart - walk;
    } else {
      carouselRef.current.scrollLeft = scrollStart - walk;
    }
  };

  return (
    <div
      ref={carouselRef}
      className={`
        w-full h-[60vh] sm:h-auto
        overflow-auto shadow-lg  select-none scrollbar scrollbar-thumb-transparent scrollbar-track-transparent
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        ${isMobile ? "mx-auto" : ""}
      `}
      style={{ width: `calc(100vw - 400px)` }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`flex gap-4 px-4 ${
          isMobile ? "flex-col items-center" : "flex-row"
        }`}
      >
        {imoveis.map((imovel) => (
          <Card key={imovel.id} imovel={imovel} />
        ))}
      </div>
    </div>
  );
}
