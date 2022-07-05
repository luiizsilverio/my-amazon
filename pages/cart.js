import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';

export default function CartScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart: { cartItems } } = state;

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
                          <td className="p-5 text-right">{item.quantity}</td>
                          <td className="p-5 text-right">R$ {item.price}</td>
                          <td className="p-5 text-center">
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )
      }
    </Layout>
  )
}
