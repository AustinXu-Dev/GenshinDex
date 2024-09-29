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

export async function POST(request) {
  const requestBody = await request.json();

  try {
    await dbConnect();
    const lastWeapon = await Weapon.findOne({}, { id: 1 }).sort({ id: -1 });
    const newId = lastWeapon ? lastWeapon.id + 1 : 1; // Increment from the last id or start from 1

    const newWeapon = new Weapon({
      ...requestBody,
      id: newId,
    });

    await newWeapon.save();

    return new Response(JSON.stringify(newWeapon), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error creating data:', error);
    return new Response('Error creating data', { status: 500 });
  }
}
