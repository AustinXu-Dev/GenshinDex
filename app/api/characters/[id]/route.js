// api/characters/[id]/route.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app/data/characters.json');

export async function PUT(request, { params }) {
    const id = parseInt(params.id);
    const updatedData = await request.json();
  
    try {
      const characters = JSON.parse(await fs.readFile(filePath, 'utf8'));
      const characterIndex = characters.findIndex(c => c.id === id);
  
      if (characterIndex === -1) return new Response('Character not found', { status: 404 });
  
      characters[characterIndex] = { ...characters[characterIndex], ...updatedData };
  
      await fs.writeFile(filePath, JSON.stringify(characters, null, 2), 'utf8');
  
      return new Response('Character updated successfully', { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Error updating data', { status: 500 });
    }
  }

export async function DELETE({ params }) {
    const id = parseInt(params.id);

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        let characters = JSON.parse(fileContents);

        characters = characters.filter(character => character.id !== id);

        await fs.writeFile(filePath, JSON.stringify(characters, null, 2), 'utf8');

        return new Response('Character deleted', { status: 200 });
    } catch (error) {
        console.error('Error reading or writing JSON file:', error);
        return new Response('Error deleting data', { status: 500 });
    }
}
