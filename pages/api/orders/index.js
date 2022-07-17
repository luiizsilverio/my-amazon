// import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import db from "../../../utils/db";

const handler = async (req, res) => {
/*
  // nao esta funcionando na Vercel...
  // para resolver, estou enviando o user na requisição
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }
  const { user } = session;
*/

  await db.connect();

  const newOrder = new Order({
    ...req.body,
    // user: user._id
  })

  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).send(order);
}

export default handler;
