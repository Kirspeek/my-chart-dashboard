import { motion } from "framer-motion";

// A soft, stylized cloud SVG
const CloudSVG = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg
    width="180"
    height="120"
    viewBox="0 0 180 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    {/* Main cloud ellipses */}
    <ellipse cx="70" cy="54" rx="54" ry="26" fill="#fff" fillOpacity="0.85" />
    <ellipse cx="120" cy="48" rx="38" ry="20" fill="#fff" fillOpacity="0.7" />
    <ellipse cx="95" cy="38" rx="44" ry="18" fill="#e0e0e0" fillOpacity="0.5" />
    {/* Lower puffs for smooth rounded bottom */}
    <ellipse cx="60" cy="68" rx="18" ry="12" fill="#fff" fillOpacity="0.7" />
    <ellipse cx="85" cy="72" rx="14" ry="10" fill="#fff" fillOpacity="0.6" />
    <ellipse cx="110" cy="68" rx="12" ry="8" fill="#e0e0e0" fillOpacity="0.4" />
    <ellipse cx="130" cy="62" rx="10" ry="7" fill="#fff" fillOpacity="0.4" />
  </svg>
);

export default function CloudAnimation() {
  // Animate clouds from left to right and loop
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        borderTopLeftRadius: "2rem",
        borderBottomLeftRadius: "2rem",
      }}
    >
      {/* Top/main cloud */}
      <motion.div
        initial={{ x: -120 }}
        animate={{ x: 220 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 22,
          ease: "linear",
        }}
        style={{ position: "absolute", top: 24, left: 0 }}
      >
        <CloudSVG />
      </motion.div>
      {/* Middle left, smaller cloud */}
      <motion.div
        initial={{ x: -80 }}
        animate={{ x: 180 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 16,
          ease: "linear",
        }}
        style={{ position: "absolute", top: 70, left: 0, opacity: 0.7 }}
      >
        <CloudSVG style={{ width: 100, height: 44, opacity: 0.7 }} />
      </motion.div>
      {/* Middle right, smallest cloud */}
      <motion.div
        initial={{ x: -60 }}
        animate={{ x: 120 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 12,
          ease: "linear",
        }}
        style={{ position: "absolute", top: 110, left: 0, opacity: 0.5 }}
      >
        <CloudSVG style={{ width: 70, height: 30, opacity: 0.5 }} />
      </motion.div>
      {/* Bottom left cloud */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 200 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 18,
          ease: "linear",
        }}
        style={{ position: "absolute", bottom: 36, left: 0, opacity: 0.6 }}
      >
        <CloudSVG style={{ width: 120, height: 50, opacity: 0.6 }} />
      </motion.div>
      {/* Bottom right cloud */}
      <motion.div
        initial={{ x: -70 }}
        animate={{ x: 140 }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 14,
          ease: "linear",
        }}
        style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.4 }}
      >
        <CloudSVG style={{ width: 90, height: 36, opacity: 0.4 }} />
      </motion.div>
    </div>
  );
}
