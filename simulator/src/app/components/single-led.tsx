interface SingleLEDProps {
  addr: number;  // LED address (0-9999)
  r: number;     // Red value (0-255)
  g: number;     // Green value (0-255)
  b: number;     // Blue value (0-255)
  brightness: number;  // Brightness (0-1)
  size?: number; // Optional size in pixels (default: 24)
}

export default function SingleLED({ addr, r, g, b, brightness, size = 24 }: SingleLEDProps) {
  // Apply brightness to RGB values
  const adjustedR = Math.round(r * brightness);
  const adjustedG = Math.round(g * brightness);
  const adjustedB = Math.round(b * brightness);

  // Create the RGB color string
  const rgbColor = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;

  // Calculate glow effect intensity based on brightness
  const glowIntensity = brightness * 0.5;

  return (
    <div
      className="rounded-full border-2 border-gray-600 transition-all duration-100"
      id={`led-${addr}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: rgbColor,
        boxShadow: brightness > 0.1
          ? `0 0 ${Math.round(size * 0.5)}px ${rgbColor}, 0 0 ${Math.round(size * 0.25)}px ${rgbColor}`
          : 'none',
      }}
    >
      {/* Inner highlight for realistic LED look */}
      <div
        className="top-1 left-1 rounded-full bg-white opacity-20"
        style={{
          width: `${Math.round(size * 0.3)}px`,
          height: `${Math.round(size * 0.3)}px`,
        }}
      />

      {/* LED label overlay when very dim or off */}
      {brightness < 0.1 && (
        <div className="inset-0 flex items-center justify-center">
          <div
            className="text-gray-400 font-mono text-xs"
            style={{ fontSize: `${Math.round(size * 0.2)}px` }}
          >
            LED
          </div>
        </div>
      )}
    </div>
  );
}
