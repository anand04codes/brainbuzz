import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage(`✅ Signup successful! Welcome ${userCredential.user.email}`);
      // Redirect to dashboard after success
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage(`❌ Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg)] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--text)]">📝 Create Your Brain Buzz Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
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
            Sign Up
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">{message}</p>
        )}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account? <a href="/signin" className="text-[var(--primary)] font-medium hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
