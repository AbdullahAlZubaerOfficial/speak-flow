import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  Modal, TextInput, Alert, Platform, ActivityIndicator, FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: 'আবদুল্লাহ আল যুবায়ের',
    username: '@zubayer_abdullah',
    bio: 'Full Stack Developer | Problem Solver | Tech Enthusiast',
    location: 'Dhaka, Bangladesh',
    hometown: 'Narsingdi, Dhaka, Bangladesh',
    relationship: 'Single',
    website: 'profile-v1-eight.vercel.app',
    followers: 1247,
    following: 199,
    postsCount: 112,
    work: 'Software Engineer at Tech Solutions BD',
    education: 'BSc in CSE, AIUB',
    joined: 'January 2022',
  });

  const [coverPhoto, setCoverPhoto] = useState('https://picsum.photos/id/1015/800/300');
  const [profilePic, setProfilePic] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');

  // Sample posts data
  const [posts, setPosts] = useState([
    { id: '1', image: 'https://picsum.photos/id/100/400/400', likes: 234, comments: 45, caption: 'Beautiful sunset today! 🌅' },
    { id: '2', image: 'https://picsum.photos/id/101/400/400', likes: 189, comments: 32, caption: 'Code is poetry ✨' },
    { id: '3', image: 'https://picsum.photos/id/102/400/400', likes: 567, comments: 89, caption: 'Weekend vibes 🎉' },
    { id: '4', image: 'https://picsum.photos/id/103/400/400', likes: 123, comments: 21, caption: 'New project launch! 🚀' },
    { id: '5', image: 'https://picsum.photos/id/104/400/400', likes: 456, comments: 67, caption: 'Coffee and code ☕' },
    { id: '6', image: 'https://picsum.photos/id/105/400/400', likes: 345, comments: 54, caption: 'Travel mode on ✈️' },
  ]);

  // Sample followers data
  const [followers, setFollowers] = useState([
    { id: '1', name: 'Anika Rahman', username: '@anika', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', isFollowing: true },
    { id: '2', name: 'Rafi Khan', username: '@rafi', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', isFollowing: false },
    { id: '3', name: 'Tasnim Islam', username: '@tasnim', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', isFollowing: true },
    { id: '4', name: 'Sabbir Ahmed', username: '@sabbir', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', isFollowing: false },
    { id: '5', name: 'Nadia Islam', username: '@nadia', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', isFollowing: true },
  ]);

  const [following, setFollowing] = useState([
    { id: '1', name: 'Mehedi Hasan', username: '@mehedi', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', isFollowing: true },
    { id: '2', name: 'Arif Hossain', username: '@arif', avatar: 'https://randomuser.me/api/portraits/men/7.jpg', isFollowing: true },
    { id: '3', name: 'Sadia Jahan', username: '@sadia', avatar: 'https://randomuser.me/api/portraits/women/8.jpg', isFollowing: false },
  ]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraRollStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraRollStatus !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return false;
      }
    }
    return true;
  };

  const pickImage = async (type: 'cover' | 'profile') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'cover' ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'cover') {
        setCoverPhoto(result.assets[0].uri);
      } else {
        setProfilePic(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async (type: 'cover' | 'profile') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'cover' ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'cover') {
        setCoverPhoto(result.assets[0].uri);
      } else {
        setProfilePic(result.assets[0].uri);
      }
    }
  };

  const showImageOptions = (type: 'cover' | 'profile') => {
    Alert.alert(
      `Change ${type === 'cover' ? 'Cover Photo' : 'Profile Picture'}`,
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => takePhoto(type) },
        { text: 'Choose from Gallery', onPress: () => pickImage(type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setProfileData({ ...profileData, [editField]: editValue });
    setIsEditing(false);
    setEditField('');
    setEditValue('');
  };

  const followUser = (id: string, type: 'followers' | 'following') => {
    if (type === 'followers') {
      setFollowers(followers.map(f => 
        f.id === id ? { ...f, isFollowing: !f.isFollowing } : f
      ));
    } else {
      setFollowing(following.map(f => 
        f.id === id ? { ...f, isFollowing: !f.isFollowing } : f
      ));
    }
  };

  const handleFollowFromModal = (userId: string, isFollowing: boolean) => {
    if (followModalType === 'followers') {
      setFollowers(followers.map(f => 
        f.id === userId ? { ...f, isFollowing: !isFollowing } : f
      ));
    } else {
      setFollowing(following.map(f => 
        f.id === userId ? { ...f, isFollowing: !isFollowing } : f
      ));
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postCard}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postStats}>
        <View style={styles.postStat}>
          <Ionicons name="heart" size={14} color="#fff" />
          <Text style={styles.postStatText}>{item.likes}</Text>
        </View>
        <View style={styles.postStat}>
          <Ionicons name="chatbubble" size={12} color="#fff" />
          <Text style={styles.postStatText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFollowerItem = ({ item }: { item: any }) => (
    <View style={styles.followerItem}>
      <Image source={{ uri: item.avatar }} style={styles.followerAvatar} />
      <View style={styles.followerInfo}>
        <Text style={styles.followerName}>{item.name}</Text>
        <Text style={styles.followerUsername}>{item.username}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.followBtn, item.isFollowing && styles.followingBtn]}
        onPress={() => handleFollowFromModal(item.id, item.isFollowing)}
      >
        <Text style={[styles.followBtnText, item.isFollowing && styles.followingBtnText]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fixed Back Button */}
      <View style={styles.fixedBackButton}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: coverPhoto }} style={styles.cover} />
          <TouchableOpacity 
            style={[styles.editIcon, styles.editCoverIcon]} 
            onPress={() => showImageOptions('cover')}
          >
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePicContainer}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          <TouchableOpacity 
            style={[styles.editIcon, styles.editProfileIcon]} 
            onPress={() => showImageOptions('profile')}
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Edit Profile Button - Responsive */}
        <TouchableOpacity style={styles.editProfileBtn} onPress={() => startEditing('name', profileData.name)}>
          <Ionicons name="pencil" size={16} color="#1877F2" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.bio}>{profileData.bio}</Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={() => { setFollowModalType('posts'); setShowFollowModal(true); }}>
              <Text style={styles.statNumber}>{profileData.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => { setFollowModalType('followers'); setShowFollowModal(true); }}>
              <Text style={styles.statNumber}>{profileData.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => { setFollowModalType('following'); setShowFollowModal(true); }}>
              <Text style={styles.statNumber}>{profileData.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.followBtnMain}>
              <Text style={styles.followBtnMainText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageBtn}>
              <Ionicons name="chatbubble-outline" size={18} color="#1877F2" />
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity onPress={() => startEditing('location', profileData.location)}>
              <Ionicons name="pencil" size={18} color="#1877F2" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={18} color="#65676B" />
            <Text style={styles.detailText}>{profileData.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="home-outline" size={18} color="#65676B" />
            <Text style={styles.detailText}>{profileData.hometown}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="heart-outline" size={18} color="#65676B" />
            <Text style={styles.detailText}>{profileData.relationship}</Text>
          </View>
        </View>

        {/* Work & Education */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work & Education</Text>
            <TouchableOpacity onPress={() => startEditing('work', profileData.work)}>
              <Ionicons name="pencil" size={18} color="#1877F2" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="briefcase-outline" size={18} color="#65676B" />
            <Text style={styles.detailText}>{profileData.work}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="school-outline" size={18} color="#65676B" />
            <Text style={styles.detailText}>{profileData.education}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color="#65676B" />
            <Text style={styles.detailText}>Joined {profileData.joined}</Text>
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Links</Text>
            <TouchableOpacity onPress={() => startEditing('website', profileData.website)}>
              <Ionicons name="pencil" size={18} color="#1877F2" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="link-outline" size={18} color="#65676B" />
            <Text style={[styles.detailText, styles.linkText]}>{profileData.website}</Text>
          </View>
        </View>

        {/* Posts Tab */}
        <View style={styles.postsSection}>
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tab, activeTab === 'posts' && styles.activeTab]} onPress={() => setActiveTab('posts')}>
              <Ionicons name="grid-outline" size={22} color={activeTab === 'posts' ? '#1877F2' : '#65676B'} />
              <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'saved' && styles.activeTab]} onPress={() => setActiveTab('saved')}>
              <Ionicons name="bookmark-outline" size={22} color={activeTab === 'saved' ? '#1877F2' : '#65676B'} />
              <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'tagged' && styles.activeTab]} onPress={() => setActiveTab('tagged')}>
              <Ionicons name="person-outline" size={22} color={activeTab === 'tagged' ? '#1877F2' : '#65676B'} />
              <Text style={[styles.tabText, activeTab === 'tagged' && styles.activeTabText]}>Tagged</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'posts' && (
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.postsGrid}
            />
          )}
          {activeTab === 'saved' && (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No saved posts yet</Text>
            </View>
          )}
          {activeTab === 'tagged' && (
            <View style={styles.emptyState}>
              <Ionicons name="person-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No tagged posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField}`}
              multiline={editField === 'bio'}
              numberOfLines={editField === 'bio' ? 3 : 1}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsEditing(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Followers/Following Modal */}
      <Modal visible={showFollowModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.followModalContent}>
            <View style={styles.followModalHeader}>
              <Text style={styles.followModalTitle}>
                {followModalType === 'followers' ? 'Followers' : followModalType === 'following' ? 'Following' : 'Posts'}
              </Text>
              <TouchableOpacity onPress={() => setShowFollowModal(false)}>
                <Ionicons name="close" size={24} color="#050505" />
              </TouchableOpacity>
            </View>
            {followModalType !== 'posts' && (
              <FlatList
                data={followModalType === 'followers' ? followers : following}
                renderItem={renderFollowerItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.followList}
              />
            )}
            {followModalType === 'posts' && (
              <View style={styles.emptyState}>
                <Ionicons name="images-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>Your posts will appear here</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedBackButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 1000,
    elevation: 1000,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
    position: 'absolute',
  },
  editCoverIcon: {
    bottom: 12,
    right: 12,
  },
  editProfileIcon: {
    bottom: 4,
    right: 4,
  },
  profilePicContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 999,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileBtn: {
    position: 'absolute',
    top: 280,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 4,
    zIndex: 1,
  },
  editProfileText: {
    fontSize: 12,
    color: '#1877F2',
    fontWeight: '500',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#050505',
  },
  username: {
    fontSize: 14,
    color: '#65676B',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#050505',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
  },
  statLabel: {
    fontSize: 13,
    color: '#65676B',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  followBtnMain: {
    flex: 2,
    backgroundColor: '#1877F2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  followBtnMainText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  messageBtn: {
    flex: 2,
    backgroundColor: '#F0F2F5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  messageBtnText: {
    color: '#1877F2',
    fontWeight: '600',
    fontSize: 14,
  },
  moreBtn: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#050505',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#050505',
    flex: 1,
  },
  linkText: {
    color: '#1877F2',
  },
  postsSection: {
    paddingBottom: 30,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1877F2',
  },
  tabText: {
    fontSize: 14,
    color: '#65676B',
  },
  activeTabText: {
    color: '#1877F2',
    fontWeight: '500',
  },
  postsGrid: {
    padding: 2,
  },
  postCard: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postStats: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#65676B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#65676B',
    fontSize: 16,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1877F2',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  followModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  followModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  followModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  followList: {
    padding: 8,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  followerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  followerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  followerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  followerUsername: {
    fontSize: 13,
    color: '#65676B',
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1877F2',
  },
  followingBtn: {
    backgroundColor: '#F0F2F5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followBtnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 13,
  },
  followingBtnText: {
    color: '#65676B',
  },
});

export default ProfileScreen;