import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true, // cria os campos createdAt e updatedAt
  }
)

// se a collection User não estiver criada, cria.
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
