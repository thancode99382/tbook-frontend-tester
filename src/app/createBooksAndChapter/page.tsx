"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBook } from '@/services/bookService';
import { FiUpload, FiPlusCircle, FiTrash2, FiBookOpen, FiChevronLeft } from 'react-icons/fi';

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
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate form
      if (!book.title.trim()) {
        throw new Error("Book title is required");
      }

      // Validate chapters
      const hasInvalidChapter = chapters.some(chapter => 
        !chapter.title.trim() || !chapter.content.trim()
      );
      
      if (hasInvalidChapter) {
        throw new Error("All chapters must have a title and content");
      }

      // Create FormData for image upload
      const formData = new FormData();
      formData.append('title', book.title);
      
      // Add chapters to form data
      formData.append('chapters', JSON.stringify(chapters));
      
      // Add image if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Submit form
      await createBook(formData);
      
      // Show success message
      setSuccessMessage('Book created successfully!');
      
      // Reset form
      setBook({ title: '' });
      setChapters([{ title: '', content: '' }]);
      setImageFile(null);
      setImagePreview(null);
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/books');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <FiChevronLeft className="mr-1" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Book</h1>
        <p className="text-muted-foreground">Add a new book with chapters to your library</p>
      </div>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md flex items-center text-sm mb-6" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center text-sm mb-6" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Book Details Section */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <FiBookOpen className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Book Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={book.title}
                onChange={handleBookChange}
                required
                className="input-focus w-full px-4 py-2 bg-background border border-input rounded-md transition duration-150 ease-in-out"
                placeholder="Enter book title"
              />
            </div>
            
            <div>
              {/* <label htmlFor="image" className="block text-sm font-medium text-foreground mb-1">
                Book Cover Image
              </label> */}
              {/* <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-input rounded-md">
                <div className="space-y-2 text-center">
                  {imagePreview ? (
                    <div>
                      <img 
                        src={imagePreview} 
                        alt="Cover preview" 
                        className="mx-auto h-40 object-contain mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="text-xs text-destructive hover:text-destructive/80 focus:outline-none underline"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer rounded-md bg-background font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Chapters Section */}
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border/40">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <h2 className="text-xl font-semibold">Chapters</h2>
            </div>
            <button
              type="button"
              onClick={addChapter}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors text-sm font-medium"
            >
              <FiPlusCircle size={16} />
              Add Chapter
            </button>
          </div>
          
          {chapters.map((chapter, index) => (
            <div 
              key={index} 
              className="mb-6 p-4 border border-border rounded-lg bg-background/60"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium">Chapter {index + 1}</h3>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapter(index)}
                    className="text-xs inline-flex items-center gap-1 text-destructive hover:text-destructive/80 focus:outline-none"
                  >
                    <FiTrash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor={`title-${index}`} className="block text-sm font-medium text-foreground mb-1">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  value={chapter.title}
                  onChange={(e) => handleChapterChange(index, e)}
                  required
                  placeholder="Enter chapter title"
                  className="input-focus w-full px-4 py-2 bg-background border border-input rounded-md transition duration-150 ease-in-out"
                />
              </div>
              
              <div>
                <label htmlFor={`content-${index}`} className="block text-sm font-medium text-foreground mb-1">
                  Content *
                </label>
                <textarea
                  id={`content-${index}`}
                  name="content"
                  value={chapter.content}
                  onChange={(e) => handleChapterChange(index, e)}
                  required
                  rows={8}
                  placeholder="Write your chapter content here..."
                  className="input-focus w-full px-4 py-2 bg-background border border-input rounded-md transition duration-150 ease-in-out font-mono text-sm"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 bg-background border border-input text-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 gradient-bg text-white font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Book'}
          </button>
        </div>
      </form>
    </div>
  );
}
