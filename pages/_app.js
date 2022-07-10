import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import { StoreProvider } from '../utils/Store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider>
        {Component.auth? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        )
        : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  )
}

export default MyApp

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=Faça Login');
    }
  })
  if (status === 'loading') {
    return <div>Carregando...</div>
  }
  return children;
}