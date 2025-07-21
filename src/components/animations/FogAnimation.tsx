import React from "react";
import Image from "next/image";

const fogPng =
  "https://www.transparentpng.com/thumb/fog/fog-png-pictures-4.png";

const fogKeyframes = `
@keyframes fog-move1 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes fog-move2 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes fog-move3 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes fog-move4 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
`;

const fogMask =
  "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)";

const containerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
  overflow: "hidden",
  borderTopLeftRadius: "2rem",
  borderBottomLeftRadius: "2rem",
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
};

const layerBase: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "200%",
  height: "100%",
  display: "flex",
};

const fogImgStyle: React.CSSProperties = {
  width: "50%",
  height: "100%",
  objectFit: "cover",
  minWidth: 0,
  maxWidth: "none",
  pointerEvents: "none",
  userSelect: "none",
  WebkitMaskImage: fogMask,
  maskImage: fogMask,
};

const gradientMaskStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  borderTopLeftRadius: "2rem",
  borderBottomLeftRadius: "2rem",
  background:
    "linear-gradient(to right, rgba(240,240,240,0.35) 0%, rgba(240,240,240,0.08) 60%, rgba(240,240,240,0) 100%)",
  zIndex: 2,
};

export default function FogAnimation() {
  return (
    <div style={containerStyle}>
      <style>{fogKeyframes}</style>
      {/* Layer 1: slow, faint */}
      <div
        style={{
          ...layerBase,
          opacity: 0.45,
          animation: "fog-move1 40s linear infinite",
        }}
      >
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
      </div>
      {/* Layer 2: medium speed, more visible */}
      <div
        style={{
          ...layerBase,
          opacity: 0.6,
          animation: "fog-move2 18s linear infinite",
        }}
      >
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
      </div>
      {/* Layer 3: fast, subtle */}
      <div
        style={{
          ...layerBase,
          opacity: 0.32,
          animation: "fog-move3 10s linear infinite",
        }}
      >
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
      </div>
      {/* Layer 4: most visible, slow drift */}
      <div
        style={{
          ...layerBase,
          opacity: 0.85,
          animation: "fog-move4 25s linear infinite",
        }}
      >
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
        <Image
          style={fogImgStyle}
          src={fogPng}
          alt="Fog"
          width={800}
          height={400}
          unoptimized
        />
      </div>
      {/* Gradient mask for soft fade at edges */}
      <div style={gradientMaskStyle} />
    </div>
  );
}
