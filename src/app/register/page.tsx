"use client";

import React, { useState } from 'react';
import { register } from '@/services/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [registerData, setRegisterData] = React.useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(registerData);
      router.push('/login'); // Redirect to home page after successful registration
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Register</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="username"
              value={registerData.username}
              onChange={handleChange}
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" 
              placeholder="Username"
              required 
            />
            <input 
              type="email" 
              name="email"
              value={registerData.email}
              onChange={handleChange}
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" 
              placeholder="Email" 
              required
            />
            <input 
              type="password" 
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" 
              placeholder="Password" 
              required
            />
            
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-gray-900 mt-4">Already have an account? <Link href="/login" className="text-sm text-blue-500 -200 hover:underline mt-4">Login</Link></p>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;