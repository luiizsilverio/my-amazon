import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Menu } from '@headlessui/react';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const { status, data: session } = useSession();

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart.cartItems])

  const logoutHandler = () => {
    Cookies.remove('my-amazon:cart')
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  }

  return (
    <>
      <Head>
        <title>
          { title ? title + " - My-Amazon" : "My-Amazon" }
        </title>
        <meta name="description" content="E-Commerce desenvolvido em React" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className={`
        flex min-h-screen flex-col justify-between
      `}>
        <header>
          <nav className={`
            flex h-12 justify-between shadow-md items-center px-4
          `}>
            <Link href="/">
              <a className="text-xl font-bold">
                My-Amazon
              </a>
            </Link>
            <div>
              <Link href="/cart">
                <a className='p-2'>
                  Carrinho
                  {cartItemsCount > 0 && (
                    <span className={`
                      ml-1 rounded-full bg-red-600 px-2 py-1
                      text-xs font-bold text-white
                    `}>
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>

              {
                status === 'loading'
                  ? 'Loading'
                  : (
                    session?.user
                      ? (
                          <Menu as="div" className="relative inline-block">
                            <Menu.Button className="text-blue-600">
                              { session.user.name }
                            </Menu.Button>
                            <Menu.Items className={`
                              absolute top-8 right-0 w-56 origin-top-right bg-white shadow-lg
                            `}>
                              <Menu.Item>
                                <DropdownLink href="/profile" className="dropdown-link">
                                  Sua Conta
                                </DropdownLink>
                              </Menu.Item>
                              <Menu.Item>
                                <DropdownLink href="/order-history" className="dropdown-link">
                                  Seus Pedidos
                                </DropdownLink>
                              </Menu.Item>
                              <Menu.Item>
                                <DropdownLink href="#" className="dropdown-link" onClick={logoutHandler}>
                                  Logout
                                </DropdownLink>
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                      )
                      : (
                        <Link href="/login">
                          <a className='p-2'>Login</a>
                        </Link>
                      )
                  )
              }

            </div>
          </nav>
        </header>

        <main className={`
          container m-auto mt-4 px-4
        `}>
          { children }
        </main>

        <footer className={`
          flex justify-center items-center h-10 shadow-inner
        `}>
          Copyright &copy; 2022 My-Amazon
        </footer>
      </div>
    </>
  );
}