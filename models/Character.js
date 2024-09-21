// models/Character.js
import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  element: { type: String, required: true },
  weapon: { type: String, required: true },
  region: { type: String, required: true },
  rarity: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true }
});

const Character = mongoose.models.Character || mongoose.model('Character', characterSchema);

export default Character;
