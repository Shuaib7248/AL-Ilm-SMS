
import React, { useState } from 'react';
import { MOCK_BOOKS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Book as BookType } from '../types';
import { Book, Search, PlusCircle, CheckCircle, Clock, X, Save, Trash2, Eye, UserCheck, RotateCcw } from 'lucide-react';

export const LibraryModule: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<BookType[]>(MOCK_BOOKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  
  const [newBook, setNewBook] = useState({
      title: '',
      author: '',
      category: '',
      isbn: ''
  });

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBook = (e: React.FormEvent) => {
      e.preventDefault();
      const book: BookType = {
          id: Date.now().toString(),
          title: newBook.title,
          author: newBook.author,
          category: newBook.category,
          isbn: newBook.isbn,
          status: 'Available'
      };
      setBooks([book, ...books]);
      setIsModalOpen(false);
      setNewBook({ title: '', author: '', category: '', isbn: '' });
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(b => b.id !== id));
      setSelectedBook(null);
    }
  };

  const handleIssueBook = () => {
    if (!selectedBook) return;
    const studentName = prompt("Enter Student Name to issue book to:");
    if (studentName) {
        const updatedBooks = books.map(b => 
            b.id === selectedBook.id 
            ? { ...b, status: 'Issued' as const, issuedTo: studentName, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } 
            : b
        );
        setBooks(updatedBooks);
        setSelectedBook(updatedBooks.find(b => b.id === selectedBook.id) || null);
        alert(`Book issued to ${studentName} successfully!`);
    }
  };

  const handleReturnBook = () => {
    if (!selectedBook) return;
    if (confirm("Confirm return of book?")) {
        const updatedBooks = books.map(b => 
            b.id === selectedBook.id 
            ? { ...b, status: 'Available' as const, issuedTo: undefined, dueDate: undefined } 
            : b
        );
        setBooks(updatedBooks);
        setSelectedBook(updatedBooks.find(b => b.id === selectedBook.id) || null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" /> {t('addBook')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
           <h3 className="font-bold text-slate-900 flex items-center gap-2">
             <Book className="w-5 h-5 text-indigo-500" /> {t('booksCatalog')}
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-600">{t('title')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('author')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('category')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('availability')}</th>
                <th className="px-6 py-4 font-medium text-slate-600">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{book.title}</td>
                  <td className="px-6 py-4 text-slate-600">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {book.status === 'Available' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> {t('available')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-xs bg-amber-50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> {t('issued')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button 
                      onClick={() => setSelectedBook(book)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-rose-500 hover:text-rose-700 font-medium text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900">{t('addBook')}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <form onSubmit={handleAddBook} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('title')}</label>
                          <input 
                              type="text" 
                              required
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newBook.title}
                              onChange={e => setNewBook({...newBook, title: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{t('author')}</label>
                          <input 
                              type="text" 
                              required
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={newBook.author}
                              onChange={e => setNewBook({...newBook, author: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('category')}</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. Academic"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newBook.category}
                                onChange={e => setNewBook({...newBook, category: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('isbn')}</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={newBook.isbn}
                                onChange={e => setNewBook({...newBook, isbn: e.target.value})}
                            />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                              type="button" 
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                              {t('cancel')}
                          </button>
                          <button 
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                              <Save className="w-4 h-4" /> {t('save')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* View Details Modal */}
      {selectedBook && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-in relative">
               <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                   <X className="w-5 h-5" />
               </button>
               
               <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                     <Book className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedBook.title}</h2>
                  <p className="text-slate-500">{selectedBook.author}</p>
               </div>

               <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                     <span className="text-sm text-slate-500">{t('isbn')}</span>
                     <span className="text-sm font-medium text-slate-900">{selectedBook.isbn}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                     <span className="text-sm text-slate-500">{t('category')}</span>
                     <span className="text-sm font-medium text-slate-900">{selectedBook.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                     <span className="text-sm text-slate-500">Status</span>
                     <span className={`text-sm font-bold ${selectedBook.status === 'Available' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {selectedBook.status}
                     </span>
                  </div>
                  {selectedBook.status === 'Issued' && (
                     <>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                           <span className="text-sm text-slate-500">Issued To</span>
                           <span className="text-sm font-medium text-slate-900">{selectedBook.issuedTo}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                           <span className="text-sm text-slate-500">Due Date</span>
                           <span className="text-sm font-medium text-slate-900">{selectedBook.dueDate}</span>
                        </div>
                     </>
                  )}
               </div>

               <div className="mt-6 flex gap-2">
                  {selectedBook.status === 'Available' ? (
                     <button 
                        onClick={handleIssueBook}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center justify-center gap-2"
                     >
                        <UserCheck className="w-4 h-4" /> {t('issueBook')}
                     </button>
                  ) : (
                     <button 
                        onClick={handleReturnBook}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center justify-center gap-2"
                     >
                        <RotateCcw className="w-4 h-4" /> Return Book
                     </button>
                  )}
                  <button 
                     onClick={() => handleDeleteBook(selectedBook.id)}
                     className="py-2 px-4 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 text-sm font-medium"
                  >
                     Delete
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
