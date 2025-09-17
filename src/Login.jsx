import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage(`✅ Login successful! Welcome ${userCredential.user.email}`);
      // Redirect to dashboard after login
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage(`❌ Login failed: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg)] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--text)]">🔐 Sign In to Brain Buzz</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white dark:bg-gray-800 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="btn w-full bg-[var(--primary)] hover:bg-[#10b981]"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">{message}</p>
        )}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account? <a href="/signup" className="text-[var(--primary)] font-medium hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
