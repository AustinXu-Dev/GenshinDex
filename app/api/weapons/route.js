// api/weapons/route.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/weapons.json');

export async function GET(request) {
  const id = parseInt(new URL(request.url).searchParams.get('id'));

  try {
    const weapons = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const weapon = id ? weapons.find(w => w.id === id) : weapons;
    if (!weapon && id) return new Response('Weapon not found', { status: 404 });

    return Response.json(weapon);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error reading data', { status: 500 });
  }
}

export async function POST(request) {
  const requestBody = await request.json();

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const weapons = JSON.parse(fileContents);
    
    // Assign a new ID (simple approach)
    const newId = weapons.length ? Math.max(...weapons.map(c => c.id)) + 1 : 1;
    const newWeapon = { ...requestBody, id: newId };

    weapons.push(newWeapon);

    await fs.writeFile(filePath, JSON.stringify(weapons, null, 2), 'utf8');

    return new Response(JSON.stringify(newWeapon), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  } catch (error) {
    console.error('Error reading or writing JSON file:', error);
    return new Response('Error creating data', { status: 500 });
  }
}
