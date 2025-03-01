import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MerchStore from '../components/shop/MerchStore';
import NFTDetails from '../components/nft/NFTDetails';
import Layout from '../components/layout/Layout';
import { getNFTDetails } from '../services/solanaService';

function MerchStorePage() {
  const { nftId } = useParams();
  const [nftDetails, setNftDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNFTDetails = async () => {
      setIsLoading(true);
      const details = await getNFTDetails(nftId);
      setNftDetails(details);
      setIsLoading(false);
    };
    
    loadNFTDetails();
  }, [nftId]);
  
  if (isLoading) {
    return <Layout><div>Loading NFT details...</div></Layout>;
  }
  
  return (
    <Layout>
      <div className="merch-store-page">
        <NFTDetails nft={nftDetails} />
        <MerchStore nftId={nftId} />
      </div>
    </Layout>
  );
}

export default MerchStorePage;
