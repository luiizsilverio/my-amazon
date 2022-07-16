import bcryptjs from 'bcryptjs';
import db from '../../../utils/db';
import User from '../../../models/User';

async function handler(req, res) {
  const { name, email, password } = req.body;

  if (req.method !== 'POST') return;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    return res.status(422).json({ message: 'Erro de validação' });
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    await db.disconnect();
    return res.status(422).json({ message: 'E-mail já cadastrado' });
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false
  })

  const user = await newUser.save();

  await db.disconnect();

  res.status(201).send({
    message: 'Usuário criado com sucesso',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  })
}

export default handler;
