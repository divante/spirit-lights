import BeamGroup from './beam-group';
import LEDStripGroup from './led-strip-group';
import { LEDData } from './types';

interface HeadlightAssemblyProps {
  // Ring LEDs (31 LEDs around the perimeter)
  ringLEDs: LEDData[];

  // Center projector
  centerLED?: LEDData;
  lowBeam?: boolean;
  highBeam?: boolean;

  // LED Strip Group (3 strips with 6 LEDs each)
  stripLEDs: LEDData[][];

  // Sizing
  size?: number;
  ledSize?: number;

  // Direction for LED strips
  direction?: 'left' | 'right';

  // Optional label
  label?: string;
}

export default function HeadlightAssembly({
  ringLEDs,
  centerLED,
  lowBeam = false,
  highBeam = false,
  stripLEDs,
  size = 300,
  ledSize = 12,
  direction = 'left',
  label
}: HeadlightAssemblyProps) {

  return (
    <div className="flex inline-block border-2 border-gray-700 rounded-lg p-4 m-2 bg-black">

      {/* Optional label */}
      {label && (
        <div className="text-center text-sm text-gray-400 mb-2 font-mono">
          {label}
        </div>
      )}

      {/* Headlight Assembly Container */}
      <div
        className="flex items-center justify-center gap-4"

      >

        {/* LED Strip Group - positioned to the right of beam group */}
        {direction == 'right' && (
          <LEDStripGroup
            strips={stripLEDs}
            size={size}
            ledSize={ledSize * 2}
            stripLength={size}
            direction={direction}
          />
        )}
        {/* Beam Group - combines ring and projector */}
        <BeamGroup
          ringLEDs={ringLEDs}
          centerLED={centerLED}
          lowBeam={lowBeam}
          highBeam={highBeam}
          size={size}
          ledSize={ledSize}
        />

        {/* LED Strip Group - positioned to the right of beam group */}
        {direction == 'left' && (
          <LEDStripGroup
            strips={stripLEDs}
            size={size}
            ledSize={ledSize * 2}
            stripLength={size}
            direction={direction}
          />
        )}
      </div>
    </div>
  );
}
