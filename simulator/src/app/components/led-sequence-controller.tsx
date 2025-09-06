'use client';

import { useState, useEffect } from 'react';
import { parse } from 'yaml';

import { LEDSequence, LEDSequenceConfig, LEDSequenceConfigChase } from './types';

interface LEDSequenceControllerProps {
  turnSignalLeft?: boolean;
  turnSignalRight?: boolean;
  lowBeam?: boolean;
  highBeam?: boolean;
}

export default function LEDSequenceController({
  turnSignalLeft = false,
  turnSignalRight = false,
  lowBeam = false,
  highBeam = false
}: LEDSequenceControllerProps) {
  const [sequences, setSequences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("LEDSequenceController - states:", { turnSignalLeft, turnSignalRight, lowBeam, highBeam });
  // Load sequences from public directory
  useEffect(() => {
    async function loadSequences() {
      try {
        // Fetch YAML file from public directory
        const response = await fetch('/led-sequence.yaml');

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const yamlText = await response.text();
        const data = parse(yamlText);
        setSequences(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load LED sequences:', error);
        setSequences([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSequences();
  }, []);


  // TODO: Process sequences data here based on current states
  // For now, keeping the existing logic as fallback
  const leftStripLeds = Array(3).fill(null).map(() => (
    // Strip 0 - Yellow turn signal for left headlight
    Array(6).fill(null).map(() => ({
      r: turnSignalLeft ? 255 : 0,
      g: turnSignalLeft ? 200 : 0,
      b: 255,
      brightness: turnSignalLeft ? 1.0 : 0
    }))
  ));

  // Generate LED data based on current states
  const leftRingLEDs = Array(31).fill(null).map((_, i) => ({
    r: 255,
    g: 0,
    b: 0,
    brightness: 1.0  // Ring LEDs for low beam
  }));

  const rightRingLEDs = Array(31).fill(null).map((_, i) => ({
    r: 0,
    g: 0,
    b: 255,
    brightness: 1.0  // Ring LEDs for high beam
  }));

  const rightStripLeds = Array(3).fill(null).map(() => (
    // Strip 0 - Yellow turn signal for right headlight
    Array(6).fill(null).map(() => ({
      r: turnSignalRight ? 255 : 0,
      g: turnSignalRight ? 200 : 0,
      b: 0,
      brightness: turnSignalRight ? 1.0 : 0
    }))
  ));

  const centerLED = {
    r: (lowBeam || highBeam) ? 255 : 0,
    g: (lowBeam || highBeam) ? 255 : 0,
    b: (lowBeam || highBeam) ? 255 : 0,
    brightness: (lowBeam || highBeam) ? 1.0 : 0
  }; // Center LED for beams

  return {
    leftStripLeds,
    rightStripLeds,
    leftRingLEDs,
    rightRingLEDs,
    centerLED
  }
}
