'use client';

import { useState } from "react";
import HeadlightAssembly from "./components/headlight-assembly";
import LightControls from "./components/light-controls";
import LEDSequenceController from "./components/led-sequence-controller";

export default function Home() {
  // Light state management
  const [lowBeam, setLowBeam] = useState(true);
  const [highBeam, setHighBeam] = useState(false);
  const [turnSignalLeft, setTurnSignalLeft] = useState(true);
  const [turnSignalRight, setTurnSignalRight] = useState(false);

  const { leftStripLeds, rightStripLeds, centerLED, leftRingLEDs, rightRingLEDs } = LEDSequenceController({
    turnSignalLeft,
    turnSignalRight,
    lowBeam,
    highBeam
  });


  console.log("Left Strip LEDs:", leftStripLeds);
  console.log("Right Strip LEDs:", rightStripLeds);
  console.log("Center LED:", centerLED);
  console.log("Left Ring LEDs:", leftRingLEDs);
  console.log("Right Ring LEDs:", rightRingLEDs);

  const size = 300;

  return (
    <div
      className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20"
      style={{
        width: '100%',
      }}>

      {/* Headlights */}
      <main className="flex gap-2 row-start-2 items-center bg-gray-500 border-4 border-black p-4 rounded-lg">
        <HeadlightAssembly
          ringLEDs={leftRingLEDs}
          centerLED={centerLED}
          stripLEDs={leftStripLeds}  // Left turn signal
          lowBeam={lowBeam}
          highBeam={highBeam}
          label="Left Headlight"
          size={300}
          direction="left"
        />
        <HeadlightAssembly
          ringLEDs={rightRingLEDs}
          centerLED={centerLED}
          stripLEDs={rightStripLeds}  // Right turn signal
          lowBeam={lowBeam}
          highBeam={highBeam}
          label="Right Headlight"
          size={300}
          direction="right"
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Light Controls */}
        <LightControls
          lowBeam={lowBeam}
          highBeam={highBeam}
          turnSignalLeft={turnSignalLeft}
          turnSignalRight={turnSignalRight}
          onLowBeamToggle={() => setLowBeam(!lowBeam)}
          onHighBeamToggle={() => setHighBeam(!highBeam)}
          onTurnSignalLeftToggle={() => setTurnSignalLeft(!turnSignalLeft)}
          onTurnSignalRightToggle={() => setTurnSignalRight(!turnSignalRight)}
        />


      </footer>
    </div>
  );
}
