// DateUtils.ts - Date formatting and manipulation utilities

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Format date to friendly display (e.g., May 17, 2025)
export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time duration in minutes to hours and minutes
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
};

// Get first day of month
export const getFirstDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month, 1);
};

// Get last day of month
export const getLastDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month + 1, 0);
};

// Get days in month
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Get day of week (0 = Sunday, 6 = Saturday)
export const getDayOfWeek = (date: Date): number => {
  return date.getDay();
};

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

// Get array of week days starting from Sunday
export const getWeekDays = (short: boolean = false): string[] => {
  if (short) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

// Get array of month names
export const getMonthNames = (short: boolean = false): string[] => {
  if (short) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};

// Get dates for a week containing the given date
export const getWeekDates = (date: Date): Date[] => {
  const result: Date[] = [];
  const day = date.getDay(); // 0 = Sunday
  
  // Calculate the first day of the week (Sunday)
  const firstDay = new Date(date);
  firstDay.setDate(date.getDate() - day);
  
  // Get all 7 days of the week
  for (let i = 0; i < 7; i++) {
    const d = new Date(firstDay);
    d.setDate(firstDay.getDate() + i);
    result.push(d);
  }
  
  return result;
};
