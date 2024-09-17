// app/api/characters/route.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/characters.json');

export async function GET(request) {
  const id = parseInt(new URL(request.url).searchParams.get('id'));

  try {
    const characters = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const character = id ? characters.find(c => c.id === id) : characters;
    if (!character && id) return new Response('Character not found', { status: 404 });

    return Response.json(character);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error reading data', { status: 500 });
  }
}

export async function POST(request) {
  const requestBody = await request.json();

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const characters = JSON.parse(fileContents);
    
    // Assign a new ID (simple approach)
    const newId = characters.length ? Math.max(characters.map(c => c.id)) + 1 : 1;
    const newCharacter = { ...requestBody, id: newId };

    characters.push(newCharacter);

    await fs.writeFile(filePath, JSON.stringify(characters, null, 2), 'utf8');

    return new Response(JSON.stringify(newCharacter), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  } catch (error) {
    console.error('Error reading or writing JSON file:', error);
    return new Response('Error creating data', { status: 500 });
  }
}
