import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getMerchForNFT } from '../../services/canvasService';

function MerchStore({ nftId }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const merchProducts = await getMerchForNFT(nftId);
      setProducts(merchProducts);
      setIsLoading(false);
    };
    
    loadProducts();
  }, [nftId]);
  
  if (isLoading) {
    return <div>Loading merchandise...</div>;
  }
  
  return (
    <div className="merch-store">
      <h2>Merchandise for Canvas #{nftId}</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default MerchStore;
