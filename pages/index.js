import { useContext } from "react";
import axios from 'axios';
import Layout from "../components/Layout";
import { toast } from "react-toastify";

import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";
// import data from '../utils/data';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async(product) => {
    const existItem = cart.cartItems.find(item => item.slug === product.slug);
    const qtd = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < qtd) {
      return toast.error('Sorry, não temos este produto em estoque.');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: qtd }
    })

    toast.success('Produto adicionado ao carrinho');
  }

  return (
    <Layout title="Home">
      <div className={`
        grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4
      `}>
        {
          products.map((product) => (
            <ProductItem
              product={ product } key={ product.slug }
              addToCartHandler={ addToCartHandler }
            />
          ))
        }
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();

  return {
    props: {
      products: products.map(db.convertDocToObj)
    }
  }
}

// products: products.map(prod => db.convertDocToObj(prod))