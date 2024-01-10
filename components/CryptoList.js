// components/CryptoList.js
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const lightTheme = {
  background: '#fff',
  text: '#000',
  headerBackground: '#f2f2f2',
};

const darkTheme = {
  background: '#121212',
  text: '#fff',
  headerBackground: '#333',
};

const TableContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const TableStyles = styled.table`
  width: 80%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: ${({ theme }) => theme.headerBackground};
  cursor: pointer;
`;

const ToggleButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.headerBackground};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  border: none;
`;

const PaginationButtons = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

const CryptoList = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // CoinGecko API endpoint for cryptocurrencies with pagination
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${currentPage}&sparkline=false`
        );
        const data = await response.json();
        setCryptocurrencies(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const nextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const getTotalPages = () => Math.ceil(cryptocurrencies.length / itemsPerPage);

  const pageNumbers = Array.from({ length: getTotalPages() }, (_, index) => index + 1);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const sortedCryptocurrencies = [...cryptocurrencies].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <TableContainer>
        <h2>Cryptocurrencies</h2>
        <TableStyles>
          <thead>
            <tr>
              <TableHeader onClick={() => handleSort('name')}>Name</TableHeader>
              <TableHeader onClick={() => handleSort('symbol')}>Symbol</TableHeader>
              <TableHeader onClick={() => handleSort('current_price')}>Price (USD)</TableHeader>
              <TableHeader onClick={() => handleSort('market_cap')}>Market Cap (USD)</TableHeader>
              <TableHeader onClick={() => handleSort('price_change_percentage_24h')}>
                24h Change (%)
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedCryptocurrencies.map((crypto) => (
              <tr key={crypto.id}>
                <td>{crypto.name}</td>
                <td>{crypto.symbol}</td>
                <td>{crypto.current_price}</td>
                <td>{crypto.market_cap}</td>
                <td style={{ color: crypto.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
                  {crypto.price_change_percentage_24h}
                </td>
              </tr>
            ))}
          </tbody>
        </TableStyles>
        <PaginationButtons>
          <ToggleButton onClick={prevPage}>&laquo; Previous</ToggleButton>
          {pageNumbers.map((pageNumber) => (
            <ToggleButton key={pageNumber} onClick={() => paginate(pageNumber)}>
              {pageNumber}
            </ToggleButton>
          ))}
          <ToggleButton onClick={nextPage}>Next &raquo;</ToggleButton>
        </PaginationButtons>
        <ToggleButton onClick={toggleDarkMode}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </ToggleButton>
      </TableContainer>
    </ThemeProvider>
  );
};

export default CryptoList;
