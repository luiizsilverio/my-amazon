import { getSession } from "next-auth/react";
import bcryptjs from 'bcryptjs';
import User from "../../../models/User";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ error: 'Method not supported' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ error: 'login required' });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    return res.status(422).json({ error: 'Validation error' });
  }

  await db.connect();
  const updateUser = await User.findById(user._id);
  updateUser.name = name;
  updateUser.email = email;

  if (password) {
    updateUser.password = bcryptjs.hashSync(password);
  }

  await updateUser.save();
  await db.disconnect();

  return res.send({ message: 'Usuário atualizado com sucesso' });
}

export default handler;
