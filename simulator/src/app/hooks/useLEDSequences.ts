'use client';

import { useState, useEffect } from 'react';
import { parse } from 'yaml';

export function useLEDSequences() {
  const [sequences, setSequences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSequences() {
      try {
        // Fetch from public directory
        const response = await fetch('/led-sequence.yaml');

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const yamlText = await response.text();
        const data = parse(yamlText);
        setSequences(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load LED sequences:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setSequences([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSequences();
  }, []);

  return { sequences, isLoading, error };
}
