import mongoose from 'mongoose';

const monsterSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  img: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  elemental: { type: String, default: null },
  hp: { type: String, required: true }, // Can be changed to Number if desired
  description: { type: String, required: true }
});

const Monster = mongoose.models.Monster || mongoose.model('Monster', monsterSchema);

export default Monster;
