"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getBooks } from "@/services/bookService";
import Link from "next/link";
import { FiArrowLeft, FiBook } from "react-icons/fi";

interface Book {
  id?: string; // Make id optional to match the service definition
  title: string;
  imageUrl?: string;
}

export default function ContentBookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await getBooks();
        setBooks(response || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookId: string) => {
    router.push(`${pathname}/${bookId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/books" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Book Library
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book Content Library</h1>
        <p className="text-muted-foreground">Browse and read your books</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-card rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <FiBook className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No books available</h3>
          <p className="text-muted-foreground mb-4">You havent added any books to your library yet.</p>
          <Link 
            href="/createBooksAndChapter" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Create your first book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-card rounded-lg shadow-sm border border-border/40 card-hover overflow-hidden cursor-pointer"
              onClick={() => {
                if (book.id) {
                  handleBookClick(book.id);
                } else {
                  console.error("Attempted to handle click for book without an ID");
                }
              }}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Click to view chapters and content
                </p>
              </div>
              <div className="px-6 py-4 bg-muted/30 border-t border-border/40 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Book ID: {book.id}</span>
                <span className="text-primary text-sm">View Content</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}