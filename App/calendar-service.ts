// CalendarService.ts - Calendar functionality
import { Book } from '../models/BookModel';
import { ReadingSession } from '../models/ReadingSessionModel';
import { bookService } from './BookService';

export interface CalendarDay {
  date: Date;
  readingSessions: ReadingSession[];
  totalPagesRead: number;
  totalMinutesRead: number;
  books: string[]; // Book IDs
}

export interface MonthData {
  year: number;
  month: number; // 0-11
  days: CalendarDay[];
  totalPagesRead: number;
  totalMinutesRead: number;
  averagePagesPerDay: number;
  averageMinutesPerDay: number;
}

export class CalendarService {
  // Get reading data for a specific day
  public async getDayData(date: Date): Promise<CalendarDay> {
    const books = await bookService.getAllBooks();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const sessionsForDay: ReadingSession[] = [];
    const bookIds: string[] = [];
    
    books.forEach(book => {
      book.readingSessions.forEach(session => {
        const sessionDate = new Date(session.date);
        if (sessionDate >= startOfDay && sessionDate <= endOfDay) {
          sessionsForDay.push(session);
          if (!bookIds.includes(book.id)) {
            bookIds.push(book.id);
          }
        }
      });
    });
    
    const totalPagesRead = sessionsForDay.reduce(
      (total, session) => total + (session.endPage - session.startPage),
      0
    );
    
    const totalMinutesRead = sessionsForDay.reduce(
      (total, session) => total + session.duration,
      0
    );
    
    return {
      date: startOfDay,
      readingSessions: sessionsForDay,
      totalPagesRead,
      totalMinutesRead,
      books: bookIds
    };
  }
  
  // Get reading data for a month
  public async getMonthData(year: number, month: number): Promise<MonthData> {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: CalendarDay[] = [];
    
    let totalPagesRead = 0;
    let totalMinutesRead = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayData = await this.getDayData(date);
      
      days.push(dayData);
      totalPagesRead += dayData.totalPagesRead;
      totalMinutesRead += dayData.totalMinutesRead;
    }
    
    const averagePagesPerDay = daysInMonth > 0 ? totalPagesRead / daysInMonth : 0;
    const averageMinutesPerDay = daysInMonth > 0 ? totalMinutesRead / daysInMonth : 0;
    
    return {
      year,
      month,
      days,
      totalPagesRead,
      totalMinutesRead,
      averagePagesPerDay,
      averageMinutesPerDay
    };
  }
  
  // Get reading streak (consecutive days with reading)
  public async getCurrentReadingStreak(): Promise<number> {
    // Start from today and go backwards
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    while (true) {
      const dayData = await this.getDayData(currentDate);
      
      if (dayData.readingSessions.length === 0) {
        break;
      }
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }
  
  // Get reading heatmap data for visualization
  public async getReadingHeatmap(year: number): Promise<{ date: string; count: number }[]> {
    const result: { date: string; count: number }[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthData = await this.getMonthData(year, month);
      
      monthData.days.forEach(day => {
        if (day.totalPagesRead > 0) {
          const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.date.getDate().toString().padStart(2, '0')}`;
          result.push({
            date: dateStr,
            count: day.totalPagesRead
          });
        }
      });
    }
    
    return result;
  }
  
  // Get books read in a specific month
  public async getBooksReadInMonth(year: number, month: number): Promise<Book[]> {
    const monthData = await this.getMonthData(year, month);
    const uniqueBookIds = new Set<string>();
    
    monthData.days.forEach(day => {
      day.books.forEach(bookId => uniqueBookIds.add(bookId));
    });
    
    const books: Book[] = [];
    
    for (const bookId of uniqueBookIds) {
      const book = await bookService.getBookById(bookId);
      if (book) {
        books.push(book);
      }
    }
    
    return books;
  }
}

// Export as singleton
export const calendarService = new CalendarService();
