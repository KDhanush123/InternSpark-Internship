import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProduct, fetchProductById, updateProduct } from '../api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await fetchProductById(id);
      const product = data.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock
      });
    } catch (err) {
      setError('Failed to load product details.');
    } finally {
      setInitialLoad(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="loader"></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <Link to="/" className="btn btn-secondary">Cancel</Link>
      </div>

      <div className="form-card">
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Product Name</label>
            <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($)</label>
              <input type="number" id="price" name="price" className="form-control" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="stock">Stock Quantity</label>
              <input type="number" id="stock" name="stock" className="form-control" value={formData.stock} onChange={handleChange} required min="0" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <input type="text" id="category" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea id="description" name="description" className="form-control" value={formData.description} onChange={handleChange} required rows="4"></textarea>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
