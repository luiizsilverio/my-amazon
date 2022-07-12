import { useContext } from 'react';
import { Router, useRouter } from 'next/router'
import Image from 'next/image';
import Link from 'next/link'
import { toast } from "react-toastify";
import axios from 'axios';

import Layout from '../../components/Layout'
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
// import data from '../../utils/data';

export default function ProductScreen(props) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { product } = props;

  // const { query } = router;
  // const { slug } = query;
  // const product = data.products.find(prod => prod.slug === slug);

  if (!product) {
    return (
      <Layout title="Produto não encontrado">
        Produto não encontrado
      </Layout>
    )
  }

  const addToCartHandler = async() => {
    const existItem = state.cart.cartItems.find(item => item.slug === product.slug);
    const qtd = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < qtd) {
      return toast.error('Sorry, não temos este produto em estoque.');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: qtd }
    })

    router.push('/cart');
  }

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Voltar para Produtos</Link>
      </div>

      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </div>

        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Categoria: {product.category}</li>
            <li>Marca: {product.brand}</li>
            <li>
              {product.rating} de {product.numReviews} avaliações
            </li>
            <li>Descrição: {product.description}</li>
          </ul>
        </div>

        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Preço</div>
              <div>R$ {product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Estoque</div>
              <div>{ product.countInStock > 0 ? 'Disponível' : 'Indisponível' }</div>
            </div>
            <button className='primary-button w-full' onClick={addToCartHandler}>
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null
    }
  }
}

// products: products.map(prod => db.convertDocToObj(prod))