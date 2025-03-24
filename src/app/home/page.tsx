"use client";

import { getBooks } from "@/services/bookService";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();

        setBooks(response.DT);
      } catch (error) {
        console.error("Error in getBooks:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-white rounded-2xl">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          List Books
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {books.map((book, index) => (
            <div key={index} className="group relative">
              {/* <img
                src="https://bizweb.dktcdn.net/thumb/1024x1024/100/363/455/products/nhagiakimnew03.jpg?v=1705552576547"
                alt={book.image || "Book image"}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              /> */}
              <div className="mt-4 flex justify-between">
                <div>
                  <h1 className="text-sm text-black  font-bold">
                    <Link
                      href={`/contentbook/${book.id}`}
                      className="group-hover:text-gray-900"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0"
                      ></span>
                      {book.title || "Unknown Title"}
                    </Link>
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
