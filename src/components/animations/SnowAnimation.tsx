import React, { useMemo } from "react";

const NUMBER_OF_SNOWFLAKES = 50;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function SnowAnimation() {
  const snowflakes = useMemo(() => {
    const createFlakes = (sizeClass: string) =>
      Array.from({ length: NUMBER_OF_SNOWFLAKES }).map((_, i) => {
        const left = random(-20, 100) + "vw";
        const blur = random(-1, 1);
        const blurVal = blur < 0 ? 0 : blur;
        
        const flickrDuration = (random(20, 40) / 10).toFixed(2) + "s";
        const flickrDelay = (random(0, 20) / -10).toFixed(2) + "s";

        const fallDuration = (random(50, 150) / 5).toFixed(2) + "s";
        const fallDelay = (random(0, 100) / -5).toFixed(2) + "s";

        const animation = `${flickrDuration} flickr ${flickrDelay} infinite, ${fallDuration} fall ${fallDelay} linear infinite`;

        return {
          id: `${sizeClass}-${i}`,
          sizeClass,
          style: {
            left,
            filter: `blur(${blurVal}px)`,
            animation,
          },
        };
      });

    return [
      ...createFlakes("sm"),
      ...createFlakes("md"),
      ...createFlakes("lg"),
      ...createFlakes("dot"), // Add dots
    ];
  }, []);

  return (
    <div
      className="snowflake-area"
      style={{
        position: "absolute",
        // Extend outside the widget to create "spill over" effect
        inset: "-3rem",
        pointerEvents: "none",
        overflow: "hidden", // Internal overflow of the snow container, not the widget
        zIndex: 9999,
        // Soften edges so snow disappears naturally
        maskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 100%)",
      }}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={flake.sizeClass === "dot" ? "snow-flake-dot" : `snow-flake ${flake.sizeClass}`}
          style={{
            ...flake.style,
            fontSize:
              flake.sizeClass === "lg"
                ? "2.25em"
                : flake.sizeClass === "md"
                ? "1.5em"
                : flake.sizeClass === "sm"
                ? "10px"
                : undefined, // dots use width/height
            width: flake.sizeClass === "dot" ? random(2, 5) + "px" : undefined,
            height: flake.sizeClass === "dot" ? random(2, 5) + "px" : undefined,
          }}
        >
          {flake.sizeClass !== "dot" && "❄"}
        </div>
      ))}
    </div>
  );
}
