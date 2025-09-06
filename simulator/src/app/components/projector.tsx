import SingleLED from './single-led';
import { LEDData } from './types';

interface ProjectorProps {
  centerLED?: LEDData;    // Center LED data
  lowBeam?: boolean;      // Low beam headlight state
  highBeam?: boolean;     // High beam headlight state
  size: number;           // Overall size in pixels
  ledSize?: number;       // Individual LED size (default: 12)
}

export default function Projector({
  centerLED,
  lowBeam = false,
  highBeam = false,
  size,
  ledSize = 12
}: ProjectorProps) {
  const normalizedCenterLED = centerLED || { r: 0, g: 0, b: 0, brightness: 0, size: ledSize * 4 };

  const centerX = size / 2;
  const centerY = size / 2;

  const centerLedOffsetX = centerX - ledSize / 4;
  const centerLedOffsetY = centerY - ledSize / 4;

  const lowBeamRadius = 0.4;
  const highBeamRadius = 0.6;
  const lowBeamSize = size * lowBeamRadius;
  const lowBeamOffsetX = centerX - lowBeamSize / 2;
  const lowBeamOffsetY = centerY - lowBeamSize / 2;

  const highBeamSize = size * highBeamRadius;
  const highBeamOffsetX = centerX - highBeamSize / 2;
  const highBeamOffsetY = centerY - highBeamSize / 2;

  return (
    <div
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(0%, -100%)',
      }}
      id="projector"
    >
      {/* Center LED */}
      <div
        className="absolute"
        style={{
          transform: `translate(${centerLedOffsetX}px, ${centerLedOffsetY}px)`,
        }}
      >
        <SingleLED
          addr={31}
          r={normalizedCenterLED.r}
          g={normalizedCenterLED.g}
          b={normalizedCenterLED.b}
          brightness={normalizedCenterLED.brightness}
          size={ledSize * 4} // Larger center LED
        />
      </div>

      {/* Low Beam Headlight */}
      {lowBeam && (
        <div
          className="absolute rounded-full border-2 border-yellow-100"
          style={{
            width: `${lowBeamSize}px`,
            height: `${lowBeamSize}px`,
            transform: `translate(${lowBeamOffsetX}px, ${lowBeamOffsetY}px)`,
            background: 'radial-gradient(circle, rgba(200, 200, 170, 0.3) 0%, transparent 70%)',
            boxShadow: '0 0 20px rgba(200, 200, 170, 0.4)',
          }}
        >
          <div className="absolute inset-0 flex items-bottom justify-center">
            <span className="text-yellow-100 text-xs font-bold">LOW</span>
          </div>
        </div>
      )}

      {/* High Beam Headlight */}
      {highBeam && (
        <div
          className="absolute rounded-full border-2 border-white"
          style={{
            width: `${highBeamSize}px`,
            height: `${highBeamSize}px`,
            transform: `translate(${highBeamOffsetX}px, ${highBeamOffsetY}px)`,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.6)',
          }}
        >
          <div className="absolute inset-0 flex items-bottom justify-center">
            <span className="text-white text-xs font-bold">HIGH</span>
          </div>
        </div>
      )}

    </div>
  );
}
