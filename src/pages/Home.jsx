import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        document.body.classList.toggle('dark');
      };
    }
  }, []);

  return (
    <div className="min-h-screen">
      <section className="hero">
        <h1>Welcome to Brain Buzz</h1>
        <p>Learn, Play, Code — Together.</p>
        <Link to="/dashboard" className="btn">Launch Dashboard</Link>
      </section>
    </div>
  );
};

export default Home;
