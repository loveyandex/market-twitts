// pages/coins/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CoinPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${slug}`);
        const data = await response.json();

        console.log(data)
        setCoinData(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    if (slug) {
      fetchCoinData();
    }
  }, [slug]);

  if (!coinData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{coinData.name}</h1>
      <p>Symbol: {coinData.symbol}</p>
      {/* Add more details as needed */}
      {JSON.stringify(coinData)}
    </div>
  );
};

export default CoinPage;
