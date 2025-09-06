import RoundLEDRing from './round-led-ring';
import Projector from './projector';
import { LEDData } from './types';

interface BeamGroupProps {
  // Ring LEDs (31 LEDs around the perimeter)
  ringLEDs: LEDData[];

  // Center projector
  centerLED?: LEDData;
  lowBeam?: boolean;
  highBeam?: boolean;

  // Sizing
  size?: number;
  ledSize?: number;

  // Optional label
  label?: string;
}

export default function BeamGroup({
  ringLEDs,
  centerLED,
  lowBeam = false,
  highBeam = false,
  size = 300,
  ledSize = 12,
  label
}: BeamGroupProps) {
  return (
    <div
      className="flex-1 w-320"
      id="beam-group"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}>

      {/* Round LED Ring - outer ring of 31 LEDs */}
      <RoundLEDRing
        leds={ringLEDs}
        size={size}
        ledSize={ledSize}
      />

      {/* Projector - center LED and beams */}
      <Projector
        centerLED={centerLED}
        lowBeam={lowBeam}
        highBeam={highBeam}
        size={size}
        ledSize={ledSize}
      />
    </div>
  );
}
