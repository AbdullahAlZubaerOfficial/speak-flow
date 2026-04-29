import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const CreatePostScreen = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map(asset => asset.uri));
    }
  };

  const handlePost = () => {
    Alert.alert('Posted!', "Your post has been created (demo)");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create post</Text>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>POST</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>আবদুল্লাহ আল যুবায়ের</Text>
          <TouchableOpacity style={styles.publicBtn}>
            <Text>🌍 Public ▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Text Input */}
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={text}
        onChangeText={setText}
      />

      {/* Background / Sticker options (simplified) */}
      <ScrollView horizontal style={styles.bgOptions} showsHorizontalScrollIndicator={false}>
        <View style={[styles.colorBox, {backgroundColor: 'white'}]} />
        <Image source={{uri: 'https://via.placeholder.com/60/FFD700'}} style={styles.sticker} />
        <Image source={{uri: 'https://via.placeholder.com/60/FF69B4'}} style={styles.sticker} />
        <View style={[styles.colorBox, {backgroundColor: '#C71585'}]} />
        <View style={[styles.colorBox, {backgroundColor: 'red'}]} />
        <View style={[styles.colorBox, {backgroundColor: 'black'}]} />
        <View style={[styles.colorBox, {backgroundColor: '#8A2BE2'}]} />
      </ScrollView>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.option} onPress={pickImage}>
        <Ionicons name="image" size={24} color="green" />
        <Text style={styles.optionText}>Photos/videos</Text>
      </TouchableOpacity>

    

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <ScrollView horizontal style={{ margin: 10 }}>
          {selectedImages.map((uri, i) => (
            <Image key={i} source={{ uri }} style={{ width: 100, height: 100, marginRight: 8, borderRadius: 8 }} />
          ))}
        </ScrollView>
      )}

      {/* Big POST Button */}
      <TouchableOpacity style={styles.bigPostButton} onPress={handlePost}>
        <Text style={styles.bigPostText}>POST</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd',paddingTop:50  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center'},
  postButton: { backgroundColor: '#1877F2', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6 },
  postButtonText: { color: 'white', fontWeight: 'bold' },
  userInfo: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 18, fontWeight: '600' },
  publicBtn: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 4, alignSelf: 'flex-start' },
  input: { fontSize: 22, padding: 15, minHeight: 150, textAlignVertical: 'top' },
  bgOptions: { flexDirection: 'row', padding: 10 },
  colorBox: { width: 50, height: 50, borderRadius: 8, marginRight: 8 },
  sticker: { width: 50, height: 50, marginRight: 8, borderRadius: 8 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  optionText: { marginLeft: 15, fontSize: 17 },
  bigPostButton: { backgroundColor: '#1877F2', margin: 15, padding: 15, borderRadius: 8, alignItems: 'center' },
  bigPostText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CreatePostScreen;