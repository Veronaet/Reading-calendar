// BookModel.ts - Defines the Book data structure
export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  coverImageUrl?: string;
  dateStarted: Date;
  dateCompleted?: Date;
  readingSessions: ReadingSession[];
  notes: string;
  rating?: number; // 1-5 scale
  tags: string[];
}

// Helper function to create a new book
export const createBook = (
  title: string,
  author: string,
  totalPages: number,
  coverImageUrl?: string,
  tags: string[] = []
): Book => {
  return {
    id: Date.now().toString(),
    title,
    author,
    totalPages,
    currentPage: 0,
    coverImageUrl,
    dateStarted: new Date(),
    readingSessions: [],
    notes: '',
    tags
  };
};

// Calculate reading progress percentage
export const calculateProgress = (book: Book): number => {
  return Math.round((book.currentPage / book.totalPages) * 100);
};
