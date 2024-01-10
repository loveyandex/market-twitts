// pages/index.js
import { useRouter } from 'next/router';
import styles from '../styles/styles.module.css'; // Adjust the path based on your project structure

const Home = ({ cryptocurrencies }) => {
  const router = useRouter();

  const handleRowClick = (id) => {
    // Handle the click event, e.g., navigate to the coin page
    router.push(`/coins/${id}`);
  };

  return (
    <div className={`${styles.container} bg-gray-100`}>
      <h1 className="text-3xl font-semibold mb-8">Cryptocurrencies</h1>
      <table className={`${styles.centeredTable} bg-white border shadow-lg rounded-lg overflow-hidden`}>
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Symbol</th>
            <th className="py-2 px-4">Current Price (USD)</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies.map((crypto) => (
            <tr key={crypto.id} onClick={() => handleRowClick(crypto.id)} className={`${styles.clickableRow} cursor-pointer transition duration-300 ease-in-out`}>
              <td className="py-2 px-4">{crypto.name}</td>
              <td className="py-2 px-4">{crypto.symbol}</td>
              <td className="py-2 px-4">{crypto.current_price}</td>
              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export async function getStaticProps() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
  );
  const cryptocurrencies = await response.json();

  return {
    props: {
      cryptocurrencies,
    },
  };
}

export default Home;
