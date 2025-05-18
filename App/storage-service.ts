// StorageService.ts - Handles local storage operations
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../models/BookModel';
import { ReadingSession } from '../models/ReadingSessionModel';

const BOOKS_STORAGE_KEY = 'reading_calendar_books';
const SESSIONS_STORAGE_KEY = 'reading_calendar_sessions';

// Book storage operations
export const saveBooks = async (books: Book[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(books);
    await AsyncStorage.setItem(BOOKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving books:', error);
    throw error;
  }
};

export const loadBooks = async (): Promise<Book[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
    if (jsonValue !== null) {
      const books = JSON.parse(jsonValue) as Book[];
      // Convert string dates back to Date objects
      return books.map(book => ({
        ...book,
        dateStarted: new Date(book.dateStarted),
        dateCompleted: book.dateCompleted ? new Date(book.dateCompleted) : undefined,
        readingSessions: book.readingSessions.map(session => ({
          ...session,
          date: new Date(session.date)
        }))
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
};

// Reading session storage operations
export const saveSessions = async (sessions: ReadingSession[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(sessions);
    await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving reading sessions:', error);
    throw error;
  }
};

export const loadSessions = async (): Promise<ReadingSession[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
    if (jsonValue !== null) {
      const sessions = JSON.parse(jsonValue) as ReadingSession[];
      // Convert string dates back to Date objects
      return sessions.map(session => ({
        ...session,
        date: new Date(session.date)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading reading sessions:', error);
    return [];
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BOOKS_STORAGE_KEY);
    await AsyncStorage.removeItem(SESSIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
