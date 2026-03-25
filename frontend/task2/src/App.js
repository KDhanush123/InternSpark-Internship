import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css'
import ProductsList from './components/ProductsList';
import ProductForm from './components/ProductForm';

import Login from './components/task3/auth/Login';
import Signup from './components/task3/auth/Signup';
import ProtectedRoute from './components/task3/auth/ProtectedRoute';

function App() {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/task3/me', {
          credentials: 'include',
        });
        setIsAuth(res.ok);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <h2>Checking authentication...</h2>;
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="top-nav">
          <Link to="/" className="brand">Intern Spark Store</Link>
          <div className="nav-right">
            {isAuth && (
              <Link to="/create" className="btn btn-primary">
                Add Product
              </Link>
            )}

            {isAuth ? (
              <button
                className="btn btn-logout"
                onClick={async () => {
                  await fetch('http://localhost:5000/api/task3/logout', {
                    method: 'POST',
                    credentials: 'include',
                  });
                  setIsAuth(false);
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/signup" className="btn btn-secondary">Signup</Link>
              </>
            )}
          </div>
        </header>
        <main className="container">
          <Routes>
            <Route
              path="/login"
              element={isAuth ? <Navigate to="/" replace /> : <Login onAuth={() => setIsAuth(true)} />}
            />
            <Route
              path="/signup"
              element={isAuth ? <Navigate to="/" replace /> : <Signup onAuth={() => setIsAuth(true)} />}
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute isAuth={isAuth}>
                  <Routes>
                    <Route path="/" element={<ProductsList />} />
                    <Route path="/create" element={<ProductForm />} />
                    <Route path="/edit/:id" element={<ProductForm />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;