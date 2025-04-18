"use client";

import { getBookById } from "@/services/bookService";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DocumentationPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const [book, setBook] = useState<any>({});
console.log(book)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Wait for the params to resolve
        const { slug } = await params;

        const bookData = await getBookById(slug); // Fetch the book using the slug
        setBook(bookData.DT);
        console.log(bookData.DT);
      } catch (error) {
        console.error("Error in getBookById:", error);
      }
    };

    fetchData(); // Call the async function to fetch the book data
  }, [params]); // Re-run if params change

  // Check if book and book.chapters are available before attempting to map
  const renderChapters = book.chapters && Array.isArray(book.chapters) ? (
    book.chapters.map((chapter: any) => (
      <div key={chapter.id} className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 pb-2 border-b border-gray-200 mb-6">
          {chapter.title}
        </h2>
        <h3 className="text-base md:text-lg font-medium text-gray-600 ml-4 mb-4">
          {chapter.content}
        </h3>
      </div>
    ))
  ) : (
    <p>No chapters available.</p>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          {book.title}
        </h1>

        {/* Render chapters */}
        {renderChapters}
      </div>
    </div>
  );
};

export default DocumentationPage;
