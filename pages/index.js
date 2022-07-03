import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>My-ECommerce</title>
        <meta name="description" content="E-Commerce desenvolvido em React" />
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      <h1 className='text-3xl font-bold'>My-ECommerce</h1>

    </div>
  )
}
