import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

// This function runs on the server
async function loadLEDSequences() {
  try {
    const filePath = path.join(process.cwd(), 'src/app/components/led-sequence.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return parse(fileContents);
  } catch (error) {
    console.error('Error loading LED sequences:', error);
    return [];
  }
}

// Server Component
export default async function LEDSequenceServerLoader() {
  const sequences = await loadLEDSequences();

  return (
    <div>
      <h2>Loaded Sequences:</h2>
      <pre>{JSON.stringify(sequences, null, 2)}</pre>
    </div>
  );
}
