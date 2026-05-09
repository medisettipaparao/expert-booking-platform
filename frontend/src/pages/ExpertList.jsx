import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Star } from 'lucide-react';

const API_URL = 'http://localhost:5000';

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const categories = ['Medical', 'Career Coaching', 'Therapy', 'Fitness', 'Finance', 'Legal'];

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/experts`, {
        params: { search, category, page, limit: 6 }
      });
      setExperts(data.experts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
    // eslint-disable-next-line
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExperts();
  };

  return (
    <div>
      <h1 className="text-center mb-4">Find an Expert</h1>
      
      <div className="filters-bar card">
        <form onSubmit={handleSearch} className="flex gap-2" style={{ flex: 1 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search className="w-5 h-5 text-secondary" style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary" style={{ color: '#64748b' }} />
          <select 
            className="input-field" 
            value={category} 
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            style={{ minWidth: '150px' }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading experts...</div>
      ) : (
        <>
          {experts.length === 0 ? (
            <div className="text-center mt-4 card">No experts found.</div>
          ) : (
            <div className="grid-3">
              {experts.map(expert => (
                <div key={expert._id} className="card flex" style={{ flexDirection: 'column', gap: '1rem' }}>
                  <div className="flex gap-4 items-center">
                    <img 
                      src={expert.image || `https://i.pravatar.cc/150?u=${expert._id}`} 
                      alt={expert.name} 
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ marginBottom: '0.25rem' }}>{expert.name}</h3>
                      <div className="badge badge-category">{expert.category}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-secondary">
                    <span>{expert.experience} Yrs Exp</span>
                    <span className="badge badge-rating flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {expert.rating}
                    </span>
                  </div>

                  <Link to={`/expert/${expert._id}`} className="btn btn-secondary text-center" style={{ width: '100%' }}>
                    View Profile & Book
                  </Link>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i} 
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                className="page-btn" 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExpertList;
