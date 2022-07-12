import Link from "next/link"

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <img
            src={product.image}
            alt={product.name}
            className="rounded shadow"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
      <Link href={`/product/${product.slug}`}>
        <a>
          <h2 className="text-lg">{product.name}</h2>
        </a>
      </Link>
      <p className="mb-2">{product.brand}</p>
      <p>R$ {product.price}</p>
      <button type="button"
        className="primary-button"
        onClick={() => addToCartHandler(product)}
      >
        Adicionar ao carrinho
      </button>
      </div>
    </div>
  )
}