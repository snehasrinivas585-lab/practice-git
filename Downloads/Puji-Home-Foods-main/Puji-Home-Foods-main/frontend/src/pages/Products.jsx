import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

const C = { gold: '#C9A84C' }

export default function Products({ searchTerm, setSearchTerm, setPage }) {
  const [category, setCategory] = useState('All')
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('https://puji-home-foods.onrender.com/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err))
  }, [])

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  return (
    <section style={{ padding: '100px 0 88px', background: '#FAF7F2', minHeight: '100vh' }}>
      <style>{`
        .products-page-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .products-title {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: bold;
          font-family: 'Playfair Display', serif;
          color: #3D0000;
        }
        .products-search-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          padding: 0 0.5rem;
        }
        .products-search {
          width: 100%;
          max-width: 400px;
          padding: 12px 18px;
          border-radius: 50px;
          border: 1px solid #C9A84C;
          outline: none;
          font-size: 0.9rem;
          background: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,.05);
        }
        .products-filters {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          margin-bottom: 2rem;
          padding: 0 0.25rem 0.5rem;
          /* fade edges on mobile */
          -webkit-mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);
        }
        .products-filters::-webkit-scrollbar { display: none; }
        .filter-btn {
          flex-shrink: 0;
          padding: 9px 18px;
          border-radius: 30px;
          border: 1px solid #C9A84C;
          background: #fff;
          color: #5B1E1E;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.85rem;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(0,0,0,.05);
        }
        .filter-btn.active {
          background: #8B0000;
          color: #fff;
          box-shadow: 0 6px 16px rgba(139,0,0,.25);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.4rem;
        }
        .products-empty {
          text-align: center;
          padding: 4rem 1rem;
          color: #9a6040;
        }

        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .products-page-inner {
            padding: 0 1rem;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.9rem;
          }
          .products-filters {
            justify-content: flex-start;
            -webkit-mask-image: linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%);
            mask-image: linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%);
          }
        }
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .products-search {
            font-size: 16px; /* prevents iOS zoom */
          }
          .filter-btn {
            padding: 8px 14px;
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="products-page-inner">
        <h1 className="products-title">
          Our <span style={{ color: C.gold }}>Products</span>
        </h1>

        <div className="products-search-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="products-search"
          />
        </div>

        <div className="products-filters">
          {['All', 'Veg Pickles', 'Non-Veg Pickles', 'Sweets', 'Hot & Snacks'].map(item => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`filter-btn${category === item ? ' active' : ''}`}
            >
              {item}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="products-empty">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '1.1rem' }}>No products found. Try a different search.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <ProductCard
                key={p._id || p.id}
                p={p}
                onWishlistClick={() => setPage && setPage('wishlist')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
