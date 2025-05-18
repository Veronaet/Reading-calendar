// BookService.ts - Book data management
import { Book, createBook } from '../models/BookModel';
import { ReadingSession, createReadingSession } from '../models/ReadingSessionModel';
import { loadBooks, saveBooks } from './StorageService';

export class BookService {
  private books: Book[] = [];
  private isLoaded: boolean = false;

  // Load books from storage
  public async loadBooksIfNeeded(): Promise<Book[]> {
    if (!this.isLoaded) {
      this.books = await loadBooks();
      this.isLoaded = true;
    }
    return this.books;
  }

  // Get all books
  public async getAllBooks(): Promise<Book[]> {
    await this.loadBooksIfNeeded();
    return [...this.books];
  }

  // Get book by ID
  public async getBookById(id: string): Promise<Book | undefined> {
    await this.loadBooksIfNeeded();
    return this.books.find(book => book.id === id);
  }

  // Add a new book
  public async addBook(
    title: string,
    author: string,
    totalPages: number,
    coverImageUrl?: string,
    tags: string[] = []
  ): Promise<Book> {
    await this.loadBooksIfNeeded();
    const newBook = createBook(title, author, totalPages, coverImageUrl, tags);
    this.books.push(newBook);
    await saveBooks(this.books);
    return newBook;
  }

  // Update a book
  public async updateBook(updatedBook: Book): Promise<Book> {
    await this.loadBooksIfNeeded();
    const index = this.books.findIndex(book => book.id === updatedBook.id);
    
    if (index === -1) {
      throw new Error(`Book with ID ${updatedBook.id} not found`);
    }
    
    this.books[index] = updatedBook;
    await saveBooks(this.books);
    return updatedBook;
  }

  // Delete a book
  public async deleteBook(id: string): Promise<void> {
    await this.loadBooksIfNeeded();
    this.books = this.books.filter(book => book.id !== id);
    await saveBooks(this.books);
  }

  // Add a reading session to a book
  public async addReadingSession(
    bookId: string,
    startPage: number,
    endPage: number,
    duration: number,
    notes?: string
  ): Promise<ReadingSession> {
    await this.loadBooksIfNeeded();
    const book = this.books.find(b => b.id === bookId);
    
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    
    const session = createReadingSession(bookId, startPage, endPage, duration, notes);
    book.readingSessions.push(session);
    book.currentPage = Math.max(book.currentPage, endPage);
    
    // If book is completed
    if (book.currentPage >= book.totalPages) {
      book.dateCompleted = new Date();
    }
    
    await saveBooks(this.books);
    return session;
  }

  // Get reading sessions for a book
  public async getBookSessions(bookId: string): Promise<ReadingSession[]> {
    await this.loadBooksIfNeeded();
    const book = this.books.find(b => b.id === bookId);
    return book ? [...book.readingSessions] : [];
  }

  // Get books by tag
  public async getBooksByTag(tag: string): Promise<Book[]> {
    await this.loadBooksIfNeeded();
    return this.books.filter(book => book.tags.includes(tag));
  }

  // Get currently reading books
  public async getCurrentlyReadingBooks(): Promise<Book[]> {
    await this.loadBooksIfNeeded();
    return this.books.filter(book => !book.dateCompleted);
  }

  // Get completed books
  public async getCompletedBooks(): Promise<Book[]> {
    await this.loadBooksIfNeeded();
    return this.books.filter(book => book.dateCompleted !== undefined);
  }
}

// Export as singleton
export const bookService = new BookService();
