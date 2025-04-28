import React from 'react';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const Homepage: React.FC = () => {
  const products = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'link_to_image' },
    { id: 2, name: 'Product 2', price: 39.99, image: 'link_to_image' },
  ];

  return (
    <motion.div
      className="p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Featured Products</h1>
      <div className="flex flex-wrap">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
};

export default Homepage;
