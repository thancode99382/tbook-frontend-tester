"use client"

import { useState, useEffect } from "react";
import { FiTrash2, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";
import { deleteBook, getBooks, updateBook } from "@/services/bookService";
import type { Book } from '@/services/bookService';
import Link from "next/link";

const BooksManagement = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<{ id: number; title: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const booksData = await getBooks();
        setBooks(booksData.DT);
        setFilteredBooks(booksData.DT);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleEditClick = (book: Book) => {
    setEditingBook({ id: Number(book.id), title: book.title });
    setNewTitle(book.title);
    setIsEditModalOpen(true);
    setUpdateError("");
  };

  const handleUpdateBook = async () => {
    if (!editingBook || !newTitle.trim()) return;

    try {
      await updateBook(editingBook.id, newTitle);
      
      // Update local state
      const updatedBooks = books.map(book => 
        Number(book.id) === editingBook.id ? { ...book, title: newTitle } : book
      );
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      
      // Close modal and reset state
      setIsEditModalOpen(false);
      setEditingBook(null);
      setNewTitle("");
      setUpdateError("");
    } catch (error) {
      setUpdateError("Failed to update book. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book Library</h1>
        <p className="text-muted-foreground">Manage your book collection</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border border-input rounded-md pl-10 pr-4 py-2 w-full input-focus"
          />
        </div>
        
        <Link href="/createBooksAndChapter" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <FiPlus className="h-4 w-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-sm p-4 animate-pulse">
              <div className="w-full h-48 bg-muted rounded-md mb-4"></div>
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">No books found</h3>
          <p className="text-muted-foreground">Try a different search or add a new book.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-card rounded-lg shadow-sm overflow-hidden card-hover border border-border/40"
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">Book ID: {book.id}</p>
                
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/contentbook/${book.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(book)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                      title="Edit Book"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (book.id) {
                          handleDelete(book.id);
                        } else {
                          console.error("Attempted to delete book without an ID");
                        }
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      title="Delete Book"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
            
            {updateError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded">
                {updateError}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Book Title
              </label>
              <input
                type="text"
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="Enter book title"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBook(null);
                  setNewTitle("");
                  setUpdateError("");
                }}
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBook}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManagement;
