import SingleLED from './single-led';
import { LEDData } from './types';

interface RoundLEDRingProps {
  leds: LEDData[];        // Array of 31 LED data for the ring
  size?: number;          // Overall ring size in pixels (default: 300)
  ledSize?: number;       // Individual LED size (default: 12)
}

export default function RoundLEDRing({
  leds,
  size = 300,
  ledSize = 12
}: RoundLEDRingProps) {
  // Ensure we have exactly 31 LEDs
  const ledCount = 31;
  const normalizedLEDs = Array(ledCount).fill(null).map((_, i) =>
    leds[i] || { r: 0, g: 0, b: 0, brightness: 0, size: ledSize }
  );

  // Calculate the arc parameters - 270 degree arc
  const arcDegrees = 270;
  const startAngle = -45; // Start position
  const radius = (size - ledSize * 2) / 2 - 10; // Leave margin for LED size and glow
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div
      className=""
      style={{
        width: `100%`,
        height: `100%`,
      }}
      id="led-ring"
    >
      {/* LEDs */}
      {normalizedLEDs.map((led, index) => {
        const angle = startAngle + (index * arcDegrees) / ledCount;
        const radian = (angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(radian);
        const y = centerY + radius * Math.sin(radian);

        return (
          <div
            key={index}
            className="absolute"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <SingleLED
              addr={index}
              r={led.r}
              g={led.g}
              b={led.b}
              brightness={led.brightness}
              size={ledSize}
            />

            {/* LED number label */}
            <div
              className="absolute text-xs text-gray-500 font-mono"
              style={{
                left: '50%',
                top: `${ledSize + 8}px`,
                transform: 'translateX(-50%)',
                fontSize: '8px',
              }}
            >
              {index}
            </div>
          </div>
        );
      })}
    </div>
  );
}
