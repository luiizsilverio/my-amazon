import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  )
}

export default MyApp
