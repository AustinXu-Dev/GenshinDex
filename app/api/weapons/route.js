import dbConnect from '@/lib/mongodb'; // Import your MongoDB connection
import Weapon from '@/models/Weapon'; // Import the Weapon model

// GET route to retrieve weapons or a specific weapon by id
export async function GET(request) {
  const id = parseInt(new URL(request.url).searchParams.get('id'));

  try {
    await dbConnect(); // Ensure the DB connection is established
    const weapons = id ? await Weapon.findOne({ id }) : await Weapon.find();
    
    if (!weapons && id) return new Response('Weapon not found', { status: 404 });

    return Response.json(weapons);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error fetching data', { status: 500 });
  }
}

// POST route to add a new weapon
export async function POST(request) {
  const requestBody = await request.json();

  try {
    await dbConnect(); // Ensure the DB connection is established

    // Create a new weapon document
    const newWeapon = new Weapon(requestBody);
    await newWeapon.save(); // Save it to the database

    return new Response(JSON.stringify(newWeapon), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error creating weapon:', error);
    return new Response('Error creating data', { status: 500 });
  }
}
