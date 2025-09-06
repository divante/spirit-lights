interface LightControlsProps {
  // Current states
  lowBeam: boolean;
  highBeam: boolean;
  turnSignalLeft: boolean;
  turnSignalRight: boolean;

  // State change handlers
  onLowBeamToggle: () => void;
  onHighBeamToggle: () => void;
  onTurnSignalLeftToggle: () => void;
  onTurnSignalRightToggle: () => void;
}

export default function LightControls({
  lowBeam,
  highBeam,
  turnSignalLeft,
  turnSignalRight,
  onLowBeamToggle,
  onHighBeamToggle,
  onTurnSignalLeftToggle,
  onTurnSignalRightToggle,
}: LightControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
      <h3 className="text-lg font-semibold text-gray-200 text-center">Light Controls</h3>

      {/* Beam Controls */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-gray-300">Headlight Beams</h4>
        <div className="flex gap-2">
          <button
            onClick={onLowBeamToggle}
            className={`px-4 py-2 rounded font-medium transition-colors ${lowBeam
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Low Beam {lowBeam ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onHighBeamToggle}
            className={`px-4 py-2 rounded font-medium transition-colors ${highBeam
                ? 'bg-blue-400 text-white hover:bg-blue-500'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            High Beam {highBeam ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Turn Signal Controls */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-gray-300">Turn Signals</h4>
        <div className="flex gap-2">
          <button
            onClick={onTurnSignalLeftToggle}
            className={`px-4 py-2 rounded font-medium transition-colors ${turnSignalLeft
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            ← Left {turnSignalLeft ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onTurnSignalRightToggle}
            className={`px-4 py-2 rounded font-medium transition-colors ${turnSignalRight
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            Right → {turnSignalRight ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
