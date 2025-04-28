import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const ProductCard = ({ product }: { product: { id: number; name: string; price: number; image: string; } }) => {
  return (
    <motion.div
      className="border rounded p-4 m-2"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h2 className="text-lg">{product.name}</h2>
      <p>${product.price}</p>
      <button className="bg-blue-500 text-white p-2 rounded">Add to Cart</button>
    </motion.div>
  );
};

export default ProductCard;
