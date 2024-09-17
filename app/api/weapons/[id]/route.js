// api/weapons/[id]/route.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/weapons.json');

export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  const updatedData = await request.json();

  try {
    const weapons = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const weaponIndex = weapons.findIndex(w => w.id === id);

    if (weaponIndex === -1) return new Response('Weapon not found', { status: 404 });

    weapons[weaponIndex] = { ...weapons[weaponIndex], ...updatedData };

    await fs.writeFile(filePath, JSON.stringify(weapons, null, 2), 'utf8');

    return new Response('Weapon updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error updating data', { status: 500 });
  }
}

export async function DELETE({ params }) {
  const id = parseInt(params.id);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    let weapons = JSON.parse(fileContents);

    weapons = weapons.filter(weapon => weapon.id !== id);

    await fs.writeFile(filePath, JSON.stringify(weapons, null, 2), 'utf8');

    return new Response('Weapon deleted', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error deleting data', { status: 500 });
  }
}
