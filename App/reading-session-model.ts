// ReadingSessionModel.ts - Defines a reading session
export interface ReadingSession {
  id: string;
  bookId: string;
  startPage: number;
  endPage: number;
  date: Date;
  duration: number; // in minutes
  notes?: string;
}

// Helper function to create a new reading session
export const createReadingSession = (
  bookId: string,
  startPage: number,
  endPage: number,
  duration: number,
  notes?: string
): ReadingSession => {
  return {
    id: Date.now().toString(),
    bookId,
    startPage,
    endPage,
    date: new Date(),
    duration,
    notes
  };
};

// Calculate pages read in a session
export const getPagesRead = (session: ReadingSession): number => {
  return session.endPage - session.startPage;
};

// Calculate average reading speed (pages per minute)
export const getReadingSpeed = (session: ReadingSession): number => {
  const pagesRead = getPagesRead(session);
  return pagesRead / session.duration;
};
