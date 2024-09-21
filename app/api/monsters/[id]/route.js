// api/monster/[id]/route.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/monsters.json');

export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  const updatedData = await request.json();

  try {
    const monsters = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const monsterIndex = monsters.findIndex(m => m.id === id);

    if (monsterIndex === -1) return new Response('Monster not found', { status: 404 });

    monsters[monsterIndex] = { ...monsters[monsterIndex], ...updatedData };

    await fs.writeFile(filePath, JSON.stringify(monsters, null, 2), 'utf8');

    return new Response('Monster updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error updating data', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    let monsters = JSON.parse(fileContents);

    monsters = monsters.filter(monster => monster.id !== id);

    await fs.writeFile(filePath, JSON.stringify(monsters, null, 2), 'utf8');

    return new Response('Monster deleted', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error deleting data', { status: 500 });
  }
}
