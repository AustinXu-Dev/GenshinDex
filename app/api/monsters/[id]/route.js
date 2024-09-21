import dbConnect from '@/lib/mongodb';
import Monster from '@/models/Monster';

export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  const updatedData = await request.json();

  try {
    await dbConnect();
    const updatedMonster = await Monster.findOneAndUpdate({ id }, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMonster) return new Response('Monster not found', { status: 404 });

    return Response.json(updatedMonster);
  } catch (error) {
    console.error('Error updating monster:', error);
    return new Response('Error updating data', { status: 500 });
  }
}

export async function DELETE({ params }) {
  const id = parseInt(params.id);

  try {
    await dbConnect();
    const deletedMonster = await Monster.findOneAndDelete({ id });

    if (!deletedMonster) return new Response('Monster not found', { status: 404 });

    return new Response('Monster deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting monster:', error);
    return new Response('Error deleting data', { status: 500 });
  }
}
