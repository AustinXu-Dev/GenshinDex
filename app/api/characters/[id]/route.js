// app/api/characters/[id]/route.js
import dbConnect from '@/lib/mongodb'; // Import your MongoDB connection
import Character from '@/models/Character'; // Import the Character model

export async function PUT(request, { params }) {
    const id = parseInt(params.id);
    const updatedData = await request.json();

    try {
        await dbConnect(); // Ensure the DB connection is established

        const updatedCharacter = await Character.findOneAndUpdate(
            { id: id }, // Find character by ID
            { $set: updatedData }, // Update with new data
            { new: true } // Return the updated document
        );

        if (!updatedCharacter) return new Response('Character not found', { status: 404 });

        return new Response(JSON.stringify(updatedCharacter), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Error updating character:', error);
        return new Response('Error updating data', { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const id = parseInt(params.id);

    try {
        await dbConnect(); // Ensure the DB connection is established

        const deletedCharacter = await Character.findOneAndDelete({ id: id }); // Delete character by ID

        if (!deletedCharacter) return new Response('Character not found', { status: 404 });

        return new Response('Character deleted', { status: 200 });
    } catch (error) {
        console.error('Error deleting character:', error);
        return new Response('Error deleting data', { status: 500 });
    }
}
