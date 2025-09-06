import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

export async function GET() {
  try {
    // Read the YAML file from the file system
    const filePath = path.join(process.cwd(), 'src/app/components/led-sequence.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading LED sequences:', error);
    return NextResponse.json(
      { error: 'Failed to load LED sequences' },
      { status: 500 }
    );
  }
}
