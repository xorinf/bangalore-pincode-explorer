import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://bangalore-pincode-explorer-production.up.railway.app/api';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('all');
  const [results, setResults] = useState([]);
  const [allPincodes, setAllPincodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load all pincodes on start
  useEffect(() => {
    fetchPincodes(1);
  }, []);

  // Simple fetch function
  const fetchPincodes = async (pageNumber) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/pincodes?page=${pageNumber}&limit=20`);
      const data = await response.json();
      if (data.success) {
        setAllPincodes(data.data);
        setTotalPages(data.totalPages);
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  // Simple search function
  const handleSearch = async () => {
    if (searchQuery === '') {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      let url = '';
      if (searchMode === 'pincode') {
        url = `${API_URL}/pincodes/${searchQuery}`;
      } else if (searchMode === 'area') {
        url = `${API_URL}/areas/${searchQuery}`;
      } else {
        url = `${API_URL}/pincodes/search?q=${searchQuery}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (Array.isArray(data.data)) {
          setResults(data.data);
        } else {
          setResults([data.data]);
        }
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Bangalore Pincodes</h1>
        <p>Simple full-stack application</p>
      </div>

      <div className="search-section">
        <div>
          <button onClick={() => setSearchMode('all')}>All Search</button>
          <button onClick={() => setSearchMode('pincode')}>Pincode</button>
          <button onClick={() => setSearchMode('area')}>Area</button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Enter search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <br/><br/>
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setSearchQuery(''); setHasSearched(false); }}>Clear</button>
      </div>

      {isLoading && <div className="loading">Loading data...</div>}

      {/* Show search results */}
      {hasSearched && !isLoading && (
        <div>
          <h2>Search Results ({results.length})</h2>
          {results.length > 0 ? (
            <div className="results-grid">
              {results.map((item, index) => (
                <div key={index} className="result-card">
                  <div className="card-pincode">{item.pincode}</div>
                  <div>Area: {item.area_name}</div>
                  <div>District: {item.district}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}

      {/* Show all data table */}
      {!hasSearched && !isLoading && (
        <div>
          <h2>All Pincodes</h2>
          <table className="pincode-table">
            <thead>
              <tr>
                <th>Pincode</th>
                <th>Area Name</th>
                <th>District</th>
              </tr>
            </thead>
            <tbody>
              {allPincodes.map((item, index) => (
                <tr key={index}>
                  <td>{item.pincode}</td>
                  <td>{item.area_name}</td>
                  <td>{item.district}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button 
              disabled={page === 1}
              onClick={() => fetchPincodes(page - 1)}
            >
              Back
            </button>
            <span> Page {page} of {totalPages} </span>
            <button 
              disabled={page === totalPages}
              onClick={() => fetchPincodes(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
