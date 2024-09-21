import dbConnect from '@/lib/mongodb';
import Weapon from '@/models/Weapon';

export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  const updatedData = await request.json();

  try {
    await dbConnect();
    const updatedWeapon = await Weapon.findOneAndUpdate({ id }, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedWeapon) return new Response('Weapon not found', { status: 404 });

    return Response.json(updatedWeapon);
  } catch (error) {
    console.error('Error updating weapon:', error);
    return new Response('Error updating data', { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);

  try {
      await dbConnect();

      const deletedWeapon = await Weapon.findOneAndDelete({ id: id });

      if (!deletedWeapon) return new Response('Weapon not found', { status: 404 });

      return new Response('Weapon deleted', { status: 200 });
  } catch (error) {
      console.error('Error deleting weapon:', error);
      return new Response('Error deleting data', { status: 500 });
  }
}