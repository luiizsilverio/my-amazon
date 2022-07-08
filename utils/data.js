import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Luiz',
      email: 'luiiz.silverio@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Sara',
      email: 'sara@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    }
  ],
  products: [
    {
      name: 'Camiseta',
      slug: 'camiseta',
      category: 'Camisas',
      image: '/images/shirt1.jpg',
      price: 70,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description: 'Uma camiseta estilosa'
    },
    {
      name: 'Camisa Fit',
      slug: 'camisa-fit',
      category: 'Camisas',
      image: '/images/shirt2.jpg',
      price: 80,
      brand: 'Adidas',
      rating: 3.2,
      numReviews: 10,
      countInStock: 20,
      description: 'Uma camiseta fit'
    },
    {
      name: 'Camisa Slim',
      slug: 'camisa-slim',
      category: 'Camisas',
      image: '/images/shirt3.jpg',
      price: 90,
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 3,
      countInStock: 20,
      description: 'Uma camiseta slim'
    },
    {
      name: 'Calça de sarja',
      slug: 'calca-sarja',
      category: 'Calças',
      image: '/images/pants1.jpg',
      price: 90,
      brand: 'Oliver',
      rating: 2.9,
      numReviews: 13,
      countInStock: 20,
      description: 'Uma calça de sarja'
    },
    {
      name: 'Calça jeans',
      slug: 'calca-jeans',
      category: 'Calças',
      image: '/images/pants2.jpg',
      price: 95,
      brand: 'Zara',
      rating: 3.5,
      numReviews: 7,
      countInStock: 20,
      description: 'Uma calça jeans'
    },
    {
      name: 'Calça jeans clássica',
      slug: 'calca-classica',
      category: 'Calças',
      image: '/images/pants3.jpg',
      price: 75,
      brand: 'Casely',
      rating: 2.4,
      numReviews: 14,
      countInStock: 20,
      description: 'Uma calça jeans clássica'
    }
  ]
}

export default data;
