// app/api/characters/route.js
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  // Define the path to the JSON file
  const filePath = path.join(process.cwd(), 'app/data/characters.json');

  try {
    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Parse the JSON data
    const characters = JSON.parse(fileContents);

    // Return the data as a JSON response
    return new Response(JSON.stringify(characters), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return new Response('Error reading data', { status: 500 });
  }
}
