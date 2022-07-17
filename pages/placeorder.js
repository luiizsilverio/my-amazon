import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic'
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

import Layout from "../components/Layout";
import CheckoutWizard, { checkout_steps } from "../components/CheckoutWizard";
import { Store } from "../utils/Store";
import { getError } from "../utils/error";

function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const { data: session } = useSession();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((acc, i) => acc + i.quantity * i.price, 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const placeOrderHandler = async () => {
    try {
      alert(JSON.stringify(session ? session.user : {}));
      setLoading(true);

      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: session?.user?._id
      })

      setLoading(false);

      dispatch({ type: 'CART_CLEAR_ITEMS' });

      Cookies.set(
        'my-amazon:cart',
        JSON.stringify({
          ...cart,
          cartItems: []
        })
      )

      router.push(`/order/${data._id}`);
    }
    catch (err) {
      setLoading(false);
      toast.error(getError(err))
    }
  }

  useEffect(() => {
    if (!paymentMethod) router.push('/payment');
  }, [paymentMethod, router])

  return (
    <Layout title={ checkout_steps[3] }>
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl font-semibold">{ checkout_steps[3] }</h1>
      {
        cartItems.length === 0 ?
        (
          <div>
            O carrinho está vazio.
            <Link href="/">Vamos comprar mais coisas</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card p-5">
                <h2 className="mb-2 text-lg">{checkout_steps[1]}</h2>
                <div>
                  {shippingAddress.fullName}, {shippingAddress.address}, {' '}
                  {shippingAddress.city}, {shippingAddress.postalCode}, {' '}
                  {shippingAddress.country}
                </div>
                <div>
                  <Link href="/shipping">Alterar</Link>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="mb-2 text-lg">{checkout_steps[2]}</h2>
                <div>{paymentMethod}</div>
                <div>
                  <Link href="/payment">Alterar</Link>
                </div>
              </div>

              <div className="card overflow-x-auto p-5">
                <h2 className="mb-2 text-lg">Itens do Pedido</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className="p-5 text-right">Quantidade</th>
                      <th className="p-5 text-right">Preço</th>
                      <th className="p-5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      cartItems.map((item) => (
                        <tr key={item._id} className="border-b">
                          <td>
                            <Link href={`/product/${item.slug}`}>
                                <a className="flex items-center">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  />
                                  &nbsp;
                                  {item.name}
                                </a>
                            </Link>
                          </td>
                          <td className="pl-5 text-right">{item.quantity}</td>
                          <td className="pl-5 text-right">R$ {item.price}</td>
                          <td className="pl-5 text-right">
                            R$ {item.quantity * item.price}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div>
                  <Link href="/cart">Alterar</Link>
                </div>
              </div>
            </div>

            <div>
              <div className="card p-5">
                <h2 className="mb-2 text-lg font-semibold">Total do Pedido</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Itens</div>
                      <div>R$ {itemsPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Imposto</div>
                      <div>R$ {taxPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Taxa de entrega</div>
                      <div>R$ {shippingPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Valor Total</div>
                      <div>R$ {totalPrice}</div>
                    </div>
                  </li>
                  <li>
                    <button
                      disable={loading}
                      onClick={placeOrderHandler}
                      className="primary-button w-full"
                    >
                      {loading ? 'Aguarde...' : 'Confirma o Pedido'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      }
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PlaceOrderScreen), {ssr: false});
PlaceOrderScreen.auth = true;
