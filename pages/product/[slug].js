import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router'

import Layout from '../../components/Layout'
import data from '../../utils/data';

export default function ProductScreen() {
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find(prod => prod.slug === slug);

  if (!product) {
    return (
      <div>Produto não encontrado</div>
    )
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
            <button className='primary-button w-full'>
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}