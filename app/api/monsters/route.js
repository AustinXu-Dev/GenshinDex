import dbConnect from '@/lib/mongodb'; 
import Monster from '@/models/Monster'; 

export async function GET(request) {
  const id = parseInt(new URL(request.url).searchParams.get('id'));

  try {
    await dbConnect(); // Ensure the DB connection is established
    const monsters = id ? await Monster.findOne({ id }) : await Monster.find();
    
    if (!monsters && id) return new Response('Monster not found', { status: 404 });

    return Response.json(monsters);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error fetching data', { status: 500 });
  }
}

export async function POST(request) {
  const requestBody = await request.json();

  try {
    await dbConnect();
    const lastMonster = await Monster.findOne({}, { id: 1 }).sort({ id: -1 });
    const newId = lastMonster ? lastMonster.id + 1 : 1; // Increment from the last id or start from 1

    const newMonster = new Monster({
      ...requestBody,
      id: newId,
    });

    await newMonster.save();

    return new Response(JSON.stringify(newMonster), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Error creating data:', error);
    return new Response('Error creating data', { status: 500 });
  }
}