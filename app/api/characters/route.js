// app/api/characters/route.js
import dbConnect from '@/lib/mongodb'; // Import your MongoDB connection
import Character from '@/models/Character'; // Import the Character model

export async function GET(request) {
  const id = parseInt(new URL(request.url).searchParams.get('id'));

  try {
    await dbConnect(); // Ensure the DB connection is established
    const characters = id ? await Character.find({ id }) : await Character.find({});
    
    if (!characters.length && id) return new Response('Character not found', { status: 404 });

    return new Response(JSON.stringify(characters), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error reading data', { status: 500 });
  }
}

export async function POST(request) {
  const requestBody = await request.json();

  try {
    await dbConnect(); // Ensure the DB connection is established
    const lastCharacter = await Character.findOne({}, { id: 1 }).sort({ id: -1 });
    const newId = lastCharacter ? lastCharacter.id + 1 : 1; // Increment from the last id or start from 1

    // Assign a new ID (you might want to adjust this logic depending on your needs)
    const newCharacter = new Character({
      ...requestBody,
      id: newId, // Set a new ID based on the current count
    });

    await newCharacter.save(); // Save the new character to MongoDB

    return new Response(JSON.stringify(newCharacter), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error creating data:', error);
    return new Response('Error creating data', { status: 500 });
  }
}
