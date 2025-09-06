import SingleLED from './single-led';
import { LEDData } from './types';

interface LEDStripGroupProps {
  // Array of 3 strips, each with 6 LEDs (total 18 LEDs)
  strips: LEDData[][];  // strips[0] = strip 1 (6 LEDs), strips[1] = strip 2 (6 LEDs), etc.
  size?: number;        // Overall group size in pixels (default: 200)
  ledSize?: number;     // Individual LED size (default: 10)
  stripLength?: number; // Length of each strip (default: 80)
  label?: string;       // Optional label
  direction?: 'left' | 'right'; // Direction for headlight orientation (default: 'left')
}

export default function LEDStripGroup({
  strips,
  size = 200,
  ledSize = 10,
  stripLength = 80,
  label,
  direction = 'left'
}: LEDStripGroupProps) {
  // Ensure we have exactly 3 strips with 6 LEDs each
  const normalizedStrips = Array(3).fill(null).map((_, stripIndex) => {
    const strip = strips[stripIndex] || [];
    return Array(6).fill(null).map((_, ledIndex) =>
      strip[ledIndex] || { r: 0, g: 0, b: 0, brightness: 0 }
    );
  });

  const centerX = size / 2;
  const centerY = size / 6;
  ledSize = Math.min(ledSize, size / 6); // Limit LED size to fit within the group height

  // Strip angle based on direction
  const angle = direction === 'left' ? 30 : -30; // 60 degrees for left, 120 degrees for right (mirror)
  const radian = (angle * Math.PI) / 180;

  // Calculate the actual length needed to reach the last LED
  const lastLedDistance = 10 + (5 * stripLength / 6); // Last LED (index 5) position
  const actualStripLength = lastLedDistance;

  // For horizontal alignment, we need to offset strips horizontally so they align at top and bottom
  const stripSpacing = ledSize * 2; // Horizontal distance between strips
  const stripStartPositions = [
    centerX - stripSpacing, // Left strip
    centerX,                // Center strip  
    centerX + stripSpacing  // Right strip
  ];

  return (
    <div className="w-32 flex gap-3 items-bottom mx-10">
      {/* Render all 3 parallel strips at 60 degrees */}
      {normalizedStrips.map((strip, stripIndex) => {
        // Use horizontal spacing for alignment
        const stripCenterX = stripStartPositions[stripIndex];
        const stripCenterY = centerY; // All strips start at same Y level

        return (
          <div key={`strip-${stripIndex}`}
            className="items-center justify-center flex-row place-content-center"
            style={{
              rotate: `${angle}deg`,
              height: `${size}px`,
            }}>
            {/* Strip trace/connection line at 60 degrees */}
            {/* LEDs in this strip */}
            {strip.map((led, ledIndex) => {
              // Position LEDs along the 60-degree angled strip
              return (
                <div
                  key={`strip-${stripIndex}-led-${ledIndex}`}
                  className="flex-grow"
                >
                  {/* LED address label */}
                  <div
                    className="text-xs text-gray-500 font-mono"
                    style={{
                      fontSize: '7px',
                    }}
                  >
                    {stripIndex * 6 + ledIndex}
                  </div>
                  <SingleLED
                    addr={stripIndex * 6 + ledIndex} // Address 0-17
                    r={led.r}
                    g={led.g}
                    b={led.b}
                    brightness={led.brightness}
                    size={ledSize}
                  />

                </div>
              );
            })}
          </div>
        );
      })}

      {/* Optional label */}
      {label && (
        <div
          className="absolute text-xs text-gray-600 font-mono"
          style={{
            left: '50%',
            bottom: '5px',
            transform: 'translateX(-50%)',
            fontSize: '10px',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
