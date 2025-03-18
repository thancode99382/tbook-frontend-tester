"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { createBook } from '@/services/bookService';

interface Chapter {
  title: string;
  content: string;
}

interface Book {
  title: string;
  imageUrl?: string;
}

export default function CreateBookAndChapter() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Book state
  const [book, setBook] = useState<Book>({
    title: '',
  });

  // Chapters state
  const [chapters, setChapters] = useState<Chapter[]>([{ title: '', content: '' }]);
  
  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle book form changes
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle chapter form changes
  const handleChapterChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedChapters = chapters.map((chapter, i) => {
      if (i === index) {
        return { ...chapter, [name]: value };
      }
      return chapter;
    });
    setChapters(updatedChapters);
  };

  // Add a new chapter
  const addChapter = () => {
    setChapters([...chapters, { title: '', content: '' }]);
  };

  // Remove a chapter
  const removeChapter = (index: number) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter((_, i) => i !== index));
    } else {
      setError("You must have at least one chapter");
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Validation
    if (!book.title) {
      setError('Book title is required');
      setIsLoading(false);
      return;
    }

    if (!imageFile) {
      setError('Book cover image is required');
      setIsLoading(false);
      return;
    }

    if (chapters.some(chapter => !chapter.title || !chapter.content)) {
      setError('All chapters must have a title and content');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add book title
      formData.append('title', book.title);
      
      // Add image file if exists
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Add chapters as JSON string
      formData.append('chapters', JSON.stringify(chapters));

      // Make API call to create book with chapters
      const response = await createBook(formData);
      console.log('Response:', response);

      setSuccessMessage('Book and chapters created successfully!');
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (err) {
      console.error('Error creating book:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create book. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Book</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Book Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Book Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={book.title}
                onChange={handleBookChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Book Cover Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Cover preview" className="h-40 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chapters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Chapters</h2>
            <button
              type="button"
              onClick={addChapter}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Chapter
            </button>
          </div>
          
          {chapters.map((chapter, index) => (
            <div key={index} className="mb-8 p-6 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Chapter {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeChapter(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  value={chapter.title}
                  onChange={(e) => handleChapterChange(index, e)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor={`content-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  id={`content-${index}`}
                  name="content"
                  value={chapter.content}
                  onChange={(e) => handleChapterChange(index, e)}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 mr-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating...' : 'Create Book'}
          </button>
        </div>
      </form>
    </div>
  );
}
