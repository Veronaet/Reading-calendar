// TextUtils.ts - Text formatting utilities

// Truncate text to specified length with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter of each word
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Format number with commas for thousands
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Calculate reading time in minutes based on average reading speed
export const calculateReadingTime = (
  pageCount: number,
  wordsPerPage: number = 250,
  wordsPerMinute: number = 200
): number => {
  const totalWords = pageCount * wordsPerPage;
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  return minutes;
};

// Format ISBN (remove hyphens for storage, add for display)
export const formatISBN = (isbn: string, addHyphens: boolean = true): string => {
  // Remove all non-numeric characters
  const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
  
  if (!addHyphens) {
    return cleanISBN;
  }
  
  // Format ISBN-13
  if (cleanISBN.length === 13) {
    return `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 4)}-${cleanISBN.slice(4, 9)}-${cleanISBN.slice(9, 12)}-${cleanISBN.slice(12)}`;
  }
  
  // Format ISBN-10
  if (cleanISBN.length === 10) {
    return `${cleanISBN.slice(0, 1)}-${cleanISBN.slice(1, 4)}-${cleanISBN.slice(4, 9)}-${cleanISBN.slice(9)}`;
  }
  
  // If not valid ISBN format, return as-is
  return cleanISBN;
};

// Generate placeholder text
export const generatePlaceholderText = (numWords: number): string => {
  const loremIpsum = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';
  
  const words = loremIpsum.split(' ');
  const result: string[] = [];
  
  for (let i = 0; i < numWords; i++) {
    result.push(words[i % words.length]);
  }
  
  return result.join(' ');
};

// Format tags for display (add # prefix, etc.)
export const formatTag = (tag: string): string => {
  // Remove spaces and special chars, convert to lowercase
  const cleanTag = tag.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Add hashtag if not already present
  return cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
};
