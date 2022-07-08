import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic'

import { XCircleIcon } from '@heroicons/react/outline'
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store);
  const { cart: { cartItems } } = state;


  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  }

  const updateCartHandler = (item, qtd) => {
    const quantity = Number(qtd);
    dispatch({ type: 'CART_ADD_ITEM', payload: {...item, quantity}})
  }

  return (
    <Layout title="Meu Carrinho">
      <h1 className="mb-4 text-xl">Meu Carrinho</h1>
      {
        cartItems.length === 0
          ? (
              <div>
                O carrinho está vazio. <Link href="/">Voltar</Link>
              </div>
            )
          : (
            <div className="grid md:grid-cols-4 md:gap-5">
              <div className="overflow-x-auto md:col-span-3">
                <table className="min-w-full">
                  <thead className='border-b'>
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className="p5 text-right">Quantidade</th>
                      <th className="p5 text-right">Preço</th>
                      <th className="p-5">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      cartItems.map((item) => (
                        <tr key={cartItems.slug} className="border-b">
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
                          <td className="pl-5 text-right">
                            <select value={item.quantity}
                              onChange={(e) => updateCartHandler(item, e.target.value)}
                            >
                            {
                              [...Array(item.countInStock).keys()].map(x => (
                                <option key={x+1} value={x+1}>
                                  {x + 1}
                                </option>
                              ))
                            }
                            </select>
                          </td>
                          <td className="pl-5 text-right">R$ {item.price}</td>
                          <td className="p-5 text-center">
                            <button onClick={() => removeItemHandler(item)}>
                              <XCircleIcon className="h-6 w-6"></XCircleIcon>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>

              <div className='card p-5'>
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                      &nbsp;
                      : R$
                      &nbsp;
                      {cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                    </div>
                  </li>
                  <li>
                    <button className="primary-button w-full"
                      onClick={() => router.push('/shipping')}
                    >
                      Comprar
                    </button>
                  </li>
                </ul>

              </div>
            </div>
          )
      }
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), {ssr: false});

