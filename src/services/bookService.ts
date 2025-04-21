import api from './api';

export interface Chapter {
  title: string;
  content: string;
}

export interface Book {
  id?: string;
  title: string;
  imageUrl?: string;
}

/**
 * Create a new book with chapters
 * @param formData FormData containing book info and chapters
 * @returns Response from API
 */
export const createBook = async (formData: FormData): Promise<any> => {
  try {
    // Extract data from formData
    const title = formData.get('title') as string;
    const imageFile = formData.get('image') as File;
    const chapters = formData.get('chapters') as string;
    
    // Create a new FormData with the structure expected by the backend
    const apiFormData = new FormData();
    
    // Create book data object according to backend expectation
    const bookData = { title };
    apiFormData.append('bookdata', JSON.stringify(bookData));
    
    // Add chapters data
    apiFormData.append('chapters', chapters);
    
    // Based on the error, Multer is configured with single('file')
    // so we must use exactly 'file' as the field name with no other file fields
    if (imageFile) {
      apiFormData.append('file', imageFile); // This must exactly match the field name expected by Multer
    }
    
    
    console.log("Sending to server:");
    console.log("- bookdata:", JSON.stringify(bookData));
    console.log("- chapters:", chapters);
    console.log("- file field name:", imageFile ? imageFile.name : null);
    
    // Reset the Content-Type - let the browser set the correct boundary
    const response = await api.post('/book/create', apiFormData);
    
    return {
      EM: "Book Created Successfully",
      DT: response.data,         
    };
  } catch (error) {
    console.error("Error in createBook:", error);
    throw error;
  }
};

/**
 * Get all books
 * @returns List of books
 */
export const getBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get('/books/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a book by id
 * @param id Book id
 * @returns Book data
 */
export const getBookById = async (id: string): Promise<Book> => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



/**
 * Update a book
 * @param bookId Book id
 * @param title Updated book title
 * @returns Updated book data
 */
export const updateBook = async (bookId: number, title: string): Promise<any> => {
  try {
    const response = await api.put(`/book/update`, {
      bookId,
      title
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a book
 * @param id Book id
 */
export const deleteBook = async (id: string): Promise<void> => {
  try {
    await api.delete(`/book/delete/${id}`);
  } catch (error) {
    throw error;
  }
};
