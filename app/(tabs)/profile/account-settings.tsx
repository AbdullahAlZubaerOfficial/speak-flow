import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const AccountSettings = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    name: 'Zubaer Ahmed',
    username: 'zubaer_dev',
    bio: 'Mobile App Developer | React Native Enthusiast',
    email: 'zubaer@example.com',
    phone: '+880 17XX-XXXXXX',
    website: 'https://zubaer.dev',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      router.navigate('/(tabs)/profile');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router]);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Your profile has been updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // You can reset to original values here if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(tabs)/profile')}>
          <Icon name="chevron-back" size={28} color="#1a1a2e" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Account Settings</Text>

        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Picture */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://picsum.photos/id/64/200' }} 
              style={styles.avatar} 
            />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Icon name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.changePhotoText}>
            {isEditing ? 'Change Profile Photo' : ''}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionHeader}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={userInfo.name}
              editable={isEditing}
              onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={userInfo.username}
              editable={isEditing}
              onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
              placeholder="Username"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={userInfo.bio}
              editable={isEditing}
              onChangeText={(text) => setUserInfo({ ...userInfo, bio: text })}
              placeholder="Write something about yourself"
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={styles.sectionHeader}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={userInfo.email}
              editable={isEditing}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={userInfo.phone}
              editable={isEditing}
              onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={userInfo.website}
              editable={isEditing}
              onChangeText={(text) => setUserInfo({ ...userInfo, website: text })}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerHeader}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={() => Alert.alert('Delete Account', 'This action cannot be undone.')}
          >
            <Icon name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.dangerText}>Delete My Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save/Cancel Buttons when editing */}
      {isEditing && (
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 55 : 30,
    paddingBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#6C5CE7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bioInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  dangerZone: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  dangerHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 10,
  },
  dangerText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AccountSettings;