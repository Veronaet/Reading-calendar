// BookForm.tsx - Form for adding/editing books
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Book } from '../models/BookModel';
import * as ImagePicker from 'expo-image-picker';

interface BookFormProps {
  book?: Book;
  onSave: (bookData: {
    title: string;
    author: string;
    totalPages: number;
    coverImageUrl?: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSave, onCancel }) => {
  const [title, setTitle] = useState<string>(book?.title || '');
  const [author, setAuthor] = useState<string>(book?.author || '');
  const [totalPages, setTotalPages] = useState<string>(book?.totalPages.toString() || '');
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(book?.coverImageUrl);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(book?.tags || []);
  
  useEffect(() => {
    // Request permissions for image picker
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Sorry, we need camera roll permissions to let you select a book cover image.'
          );
        }
      }
    })();
  }, []);
  
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a book title');
      return false;
    }
    
    if (!author.trim()) {
      Alert.alert('Error', 'Please enter an author name');
      return false;
    }
    
    const pages = parseInt(totalPages);
    if (isNaN(pages) || pages <= 0) {
      Alert.alert('Error', 'Please enter a valid number of pages');
      return false;
    }
    
    return true;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    onSave({
      title: title.trim(),
      author: author.trim(),
      totalPages: parseInt(totalPages),
      coverImageUrl,
      tags
    });
  };
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCoverImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };
  
  const addTag = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };
  
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>
            {book ? 'Edit Book' : 'Add New Book'}
          </Text>
          
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Book title"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Author name"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.label}>Total Pages</Text>
          <TextInput
            style={styles.input}
            value={totalPages}
            onChangeText={setTotalPages}
            placeholder="Number of pages"
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />
          
          <Text style={styles.label}>Cover Image</Text>
          <View style={styles.imageContainer}>
            {coverImageUrl ? (
              <Image source={{ uri: coverImageUrl }} style={styles.coverImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Cover</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {coverImageUrl ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add tags (e.g., fiction, fantasy)"
              placeholderTextColor="#999"
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.tagButton} onPress={addTag}>
              <Text style={styles.tagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(index)}>
                  <Text style={styles.removeTag}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeholderText: {
    color: '#999',
    fontWeight: '500',
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  tagButton: {
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tagButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  tagText: {
    color: '#1976d2',
    fontSize: 14,
    marginRight: 6,
  },
  removeTag: {
    color: '#1976d2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookForm;
