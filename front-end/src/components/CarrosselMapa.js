"use client";
import { useRef, useState, useEffect } from "react";
import Card from "./CardMapa";

export default function CarrosselMapa({ imoveis }) {
  const carouselRef = useRef(null);
  const sheetRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [height, setHeight] = useState(260); // altura inicial do bottom sheet
  const [startY, setStartY] = useState(null);
  const [startHeight, setStartHeight] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------- DESKTOP (scroll horizontal) ----------
  const handleMouseDown = (e) => {
    if (isMobile) return;
    setIsDragging(true);
    setStartPos(e.pageX - carouselRef.current.offsetLeft);
    setScrollStart(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || isMobile) return;
    e.preventDefault();
    const pos = e.pageX - carouselRef.current.offsetLeft;
    const walk = pos - startPos;
    carouselRef.current.scrollLeft = scrollStart - walk;
  };

  // ---------- MOBILE (bottom sheet arrastável) ----------
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setStartY(e.touches[0].clientY);
    setStartHeight(height);
  };

  const handleTouchMove = (e) => {
    if (!isMobile || startY === null) return;
    const deltaY = startY - e.touches[0].clientY;
    let newHeight = startHeight + deltaY;

    if (newHeight < 100) newHeight = 120; // altura mínima
    if (newHeight > window.innerHeight * 0.9)
      newHeight = window.innerHeight * 1; // máxima

    setHeight(newHeight);

    setIsExpanded(newHeight >= window.innerHeight * 0.95);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setStartY(null);
  };

  return (
    <>
      {isMobile ? (
        // ---------- MOBILE: Bottom Sheet ----------
        <div
          ref={sheetRef}
          className={`fixed bottom-0 left-0 w-full shadow-2xl transition-all duration-200 z-[1001] overflow-hidden ${
            isExpanded ? "bg-white" : "bg-transparent"
          }`}
          style={{ height: `${height}px` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isExpanded && (
            <img
              src="images/top-carousel.svg"
              alt="topo"
              className="absolute z-1"
            />
          )}

          {/* handle para arrastar */}
          <div className="w-full flex justify-center p-2 cursor-grab">
            <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
          </div>

          <div className={`overflow-auto h-full px-4 pb-6 z-10 ${isExpanded && "pt-30"}`}>
            {isExpanded && (
              <div className="px-4 pb-2 items-center flex justify-center">
                <button className="bg-gradient-to-b from-[#324587] to-[#0C1121] text-sm px-4 py-2 rounded-full shadow">
                  <p className="text-gray-400 font-bold">
                    Ordenado por: <span className="text-white">Relevância</span>
                  </p>
                </button>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {imoveis.map((imovel) => (
                <Card key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ---------- DESKTOP: Carrossel Horizontal ----------
        <div
          ref={carouselRef}
          className={`w-full overflow-auto select-none scrollbar scrollbar-thumb-transparent scrollbar-track-transparent cards-carrossel
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
          `}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-4 px-4 flex-row">
            {imoveis.map((imovel) => (
              <Card key={imovel.id} imovel={imovel} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
