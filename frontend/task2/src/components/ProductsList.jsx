import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../api';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError('Could not connect to the backend API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product forever?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete the product.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Store Inventory</h1>
        <span style={{ color: 'var(--text-muted)' }}>{products.length} Products</span>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: '#ffebe9', borderRadius: '12px', marginBottom: '2rem' }}>{error}</div>}

      {products.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No products in your store</h3>
          <p>Get started by adding your first product to the inventory.</p>
          <Link to="/create" className="btn btn-primary">Add Product</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="card">
              <div className="card-category">{product.category}</div>
              <h3 className="card-title">{product.name}</h3>
              <div className="card-price">${parseFloat(product.price).toFixed(2)}</div>
              <p className="card-desc">{product.description}</p>
              
              <div className="card-actions">
                <Link to={`/edit/${product._id}`} className="btn btn-secondary">
                  Edit Details
                </Link>
                <button onClick={() => handleDelete(product._id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
