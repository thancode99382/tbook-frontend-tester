"use client"

// import { getBooks } from "@/services/bookService";

// import React, { useEffect } from "react";
// function Books() {
//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await getBooks();
//         console.log(response.DT[0]);
//       } catch (error) {
//         console.error("Error in getBooks:", error);
//       }
//     };

//     fetchBooks();
//   }, []);

//   return <div>crud book</div>;
// }

// export default Books;




import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteBook, getBooks } from "@/services/bookService";

const StudentManagementTable = () => {
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



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    
    
    fullName: "",
    age: "",
    grade: "",
    email: "",
    contact: ""

  });




  const handleAdd = () => {
    setEditingStudent(null);
    setNewStudent({
      fullName: "",
      age: "",
      grade: "",
      email: "",
      contact: ""
    });
    setIsModalOpen(true);
  };

  

  const handleDelete =  async  (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      // delete books
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
    //   setStudents(students.map(student =>
    //     student.id === editingStudent.id
    //       ? { ...student, ...newStudent }
    //       : student
    //   ));
    } else {
    //   setStudents([
    //     ...students,
    //     {
    //       ...newStudent,
    //       id: students.length + 1,
    //       createdAt: new Date(),
    //       isActive: true
    //     }
    //   ]);
    // }
    setIsModalOpen(false);
  };

  };

    function handleEdit(book: never): void {
        throw new Error("Function not implemented.");
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Books Management</h1>
        
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Title" , "Image", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">{book.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{book.image}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* <button
                    onClick={() => handleEdit(book)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FiEdit2 className="inline" />
                  </button> */}
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStudent.fullName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStudent.age}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, age: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grade
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStudent.grade}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, grade: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStudent.contact}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, contact: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {editingStudent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagementTable;
