"use client";

import React, { useState } from 'react';
import { login } from '@/services/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(loginData);
      // Add a small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace('/home');
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gradient">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your book library</p>
        </div>
        
        <div className="bg-card rounded-xl shadow-lg card-shadow p-8 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md flex items-center text-sm" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="input-focus w-full px-4 py-2 bg-background border border-input rounded-md transition duration-150 ease-in-out" 
                placeholder="you@example.com" 
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors">
                  Forgot password?
                </a>
              </div>
              <input 
                id="password"
                type="password" 
                name="password"
                value={loginData.password}
                onChange={handleChange}
                className="input-focus w-full px-4 py-2 bg-background border border-input rounded-md transition duration-150 ease-in-out" 
                placeholder="••••••••" 
                required
              />
            </div>
            
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full gradient-bg text-white font-medium py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium">
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
