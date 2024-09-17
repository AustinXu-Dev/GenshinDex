// api/monsters/route.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/monsters.json');

export async function GET(request) {
  const id = parseInt(new URL(request.url).searchParams.get('id'));

  try {
    const monsters = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const monster = id ? monsters.find(m => m.id === id) : monsters;
    if (!monster && id) return new Response('Monster not found', { status: 404 });

    return Response.json(monster);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error reading data', { status: 500 });
  }
}

export async function POST(request) {
  const requestBody = await request.json();

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const monsters = JSON.parse(fileContents);
    
    // Assign a new ID (simple approach)
    const newId = monsters.length ? Math.max(monsters.map(m => m.id)) + 1 : 1;
    const newMonster = { ...requestBody, id: newId };

    monsters.push(newMonster);

    await fs.writeFile(filePath, JSON.stringify(monsters, null, 2), 'utf8');

    return new Response(JSON.stringify(newMonster), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  } catch (error) {
    console.error('Error reading or writing JSON file:', error);
    return new Response('Error creating data', { status: 500 });
  }
}
