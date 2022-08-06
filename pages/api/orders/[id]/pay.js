import { getSession } from "next-auth/react";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ success: false, message: 'signin required' });
  }

  const { user } = session;
  const { orderId, cardId, name } = req.body;
  let { amount } = req.body;

  amount = +amount * 100; /* valor deve ser multiplicado por 100 */

  if (!orderId || !cardId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Informe o n.pedido, o n.cartao e o valor'
    });
  }

  // Cria um objeto com dados do pagamento em cartão

  const paymentOptions = {
    amount,
    currency: "BRL",
    description: "My-Amazon",
    payment_method: cardId,
    confirm: true,
  }

  // Opcionalmente, podemos passar os dados do cliente (nome, email)

  if (user.email && name) {
    const customer = await stripe.customers.create({
      email: user.email,
      name,
    });
    paymentOptions.customer = customer.id;
  }

  // Envia o pagamento para a API do Stripe

  let paymentResult

  try {
    const payment = await stripe.paymentIntents.create(paymentOptions);

    paymentResult = {
      id: payment.id,
      status: payment.charges.data[0].outcome.type,
      email_address: user.email,
      message: payment.charges.data[0].outcome.seller_message,
      url: payment.charges.data[0].receipt_url,
    }

  } catch (error) {
    console.warn("Erro:", error);
    return res.json({ success: false, message: "Pagamento falhou" });
  }

  // Grava os dados do pagamento no banco de dados

  await db.connect();
  const order = await Order.findById(orderId);

  if (order) {
    if (order.isPaid) {
      return res.status(400).json({ success: false, message: 'Erro: Pedido já está pago.'});
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult;

    const paidOrder = await order.save();
    await db.disconnect();

    res.json({
      success: true,
      message: 'Pagamento efetuado com sucesso',
      order: paidOrder
    });
  }
  else {
    await db.disconnect();
    res.status(404).json({ success: false, message: 'Erro: Pedido não encontrado' });
  }
}

export default handler;
