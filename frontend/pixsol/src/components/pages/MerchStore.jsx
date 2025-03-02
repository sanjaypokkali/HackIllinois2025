import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout'; // Import Layout component
import "../../styles/MerchStore.css";   

const merchandise = [
  {
    id: 1,
    name: 'Pixsol T-Shirt',
    description: 'A stylish T-shirt featuring the Pixsol logo',
    price: 0.3,
    image_url: '/2.jpeg',
    category: 'tshirt',
    nft_address: 'D2ap1x2uX8TFr6CZ89HXDP3DtybF5XDWSrB6HiLeZXQQ'
  },
  {
    id: 2,
    name: 'Pixsol Mug',
    description: 'A ceramic mug for your favorite beverages',
    price: 0.09,
    image_url: '/3.jpeg',
    category: 'mug',
    nft_address: 'D2ap1x2uX8TFr6CZ89HXDP3DtybF5XDWSrB6HiLeZXQQ'
  },
  {
    id: 3,
    name: 'Pixsol Hoodie',
    description: 'A cozy hoodie with the Pixsol branding',
    price: 0.5,
    image_url: '/1.jpeg',
    category: 'hoodie',
    nft_address: 'D2ap1x2uX8TFr6CZ89HXDP3DtybF5XDWSrB6HiLeZXQQ'
  }
];

function MerchStore() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [filterCategory, setFilterCategory] = useState('');


  // Simulating API call
  useEffect(() => {
    setItems(merchandise);
    setFilteredItems(merchandise);
  }, []);

  // Convert price from string to float
  const getPriceValue = (priceStr) => parseFloat(priceStr.replace(' SOL', ''));

  // Sorting function
  const handleSort = (option) => {
    setSortOption(option);
    let sortedItems = [...filteredItems];

    if (option === 'priceLowHigh') {
      sortedItems.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
    } else if (option === 'priceHighLow') {
      sortedItems.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
    } else if (option === 'name') {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredItems(sortedItems);
  };

  // Filtering function
  const handleFilter = (category) => {
    setFilterCategory(category);
    if (category === '') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === category));
    }
  };



  const handleBuy = (nft, price) => {
    console.log("Buying item:", nft, price);
    const payload = {
        "nftAddress": nft,
        "totalAmount": price,
  };
  const options = {
    method: 'POST', // or 'PUT', 'PATCH' depending on the API endpoint
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
  fetch('https://a5d7-130-126-255-236.ngrok-free.app/payout-creators', options)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('API response:', data);
  })
  .catch(error => {
    console.error('Error during API call:', error);
  });
  alert("Creators Paid Out!");

}
  return (
    <Layout>
      <div className="merch-container">
        <h1>Pixsol Merch Store</h1>

        {/* Sorting & Filtering */}
        <div className="controls">
          <select onChange={(e) => handleSort(e.target.value)} value={sortOption}>
            <option value="">Sort By</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="name">Name</option>
          </select>

          <select onChange={(e) => handleFilter(e.target.value)} value={filterCategory}>
            <option value="">All Categories</option>
            <option value="tshirt">T-Shirts</option>
            <option value="hoodie">Hoodies</option>
            <option value="mug">Mugs</option>
          </select>
        </div>

        {/* Merch Items */}
        <div className="merch-grid">
          {filteredItems.map((item) => (
            <div className="merch-card" key={item.id}>
              <img src={item.image_url} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">{item.price} SOL</p> {/* No .toFixed() needed for SOL */}
              <button className="buy-btn" onClick={() => handleBuy(item?.nft_address, item?.price)}>Buy</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default MerchStore;
