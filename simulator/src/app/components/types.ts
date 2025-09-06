export interface LEDSequenceConfigChase {
  direction?: 'f' | 'b' | 'all'; // forward, backward or both
  spacing?: number; // spacing between chase LEDs
  speedOffset?: number; // speed offset in ms. defaults to zero which is when the chase moves one LED per cycle
}

export interface LEDSequenceConfig {
  color: string; // hex color, e.g. "#FF0000"
  pattern: 'static' | 'blink' | 'fade' | 'breathe';
  speed?: number; // speed in ms
  brightness?: number; // brightness (0-1), default 1
  count?: number; // number of LEDs to affect, default all
  startIndex?: number; // starting LED index for patterns, default 0
  chase: LEDSequenceConfigChase;
}

export interface LEDSequence {
  name: string;
  description?: string;
  centerLEDSequence?: LEDSequenceConfig;
  ringLEDSequence?: LEDSequenceConfig;
  stripLEDSequence?: [LEDSequenceConfig]; // array of 3 configs, one per strip
}

export interface LEDData {
  r: number;
  g: number;
  b: number;
  brightness: number;
  size?: number;
}
