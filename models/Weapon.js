import mongoose from 'mongoose';

const weaponSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  rarity: { type: Number, required: true, min: 1, max: 5 },
  baseattack: { type: String, required: true },
  substat: { type: String, required: true },
  passiveAbility: { type: String, required: true } // Ensure this matches your JSON
});

const Weapon = mongoose.models.Weapon || mongoose.model('Weapon', weaponSchema);

export default Weapon;
