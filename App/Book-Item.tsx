// BookItem.tsx - Component for displaying a book in a list
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Book, calculateProgress } from '../models/BookModel';
import { truncateText } from '../utils/TextUtils';
import { formatDateDisplay } from '../utils/DateUtils';

interface BookItemProps {
  book: Book;
  onPress: (book: Book) => void;
  compact?: boolean;
}

const BookItem: React.FC<BookItemProps> = ({ book, onPress, compact = false }) => {
  const progress = calculateProgress(book);
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer} 
        onPress={() => onPress(book)}
      >
        {book.coverImageUrl ? (
          <Image 
            source={{ uri: book.coverImageUrl }} 
            style={styles.compactCover} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.compactCover, styles.noCover]}>
            <Text style={styles.noCoverText}>{book.title.substring(0, 2)}</Text>
          </View>
        )}
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {truncateText(book.title, 30)}
          </Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(book)}
    >
      {book.coverImageUrl ? (
        <Image 
          source={{ uri: book.coverImageUrl }} 
          style={styles.cover} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cover, styles.noCover]}>
          <Text style={styles.noCoverText}>{book.title.substring(0, 2)}</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        
        <View style={styles.stats}>
          <Text style={styles.pages}>
            {book.currentPage} / {book.totalPages} pages
          </Text>
          <Text style={styles.date}>
            Started: {formatDateDisplay(book.dateStarted)}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
        
        {book.tags.length > 0 && (
          <View style={styles.tags}>
            {book.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {book.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{book.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  noCover: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stats: {
    marginBottom: 12,
  },
  pages: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#4caf50',
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 10,
    fontSize: 10,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#1976d2',
  },
  moreTagsText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
    alignSelf: 'center',
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactCover: {
    width: 40,
    height: 60,
    borderRadius: 4,
  },
  compactInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
});

export default BookItem;
