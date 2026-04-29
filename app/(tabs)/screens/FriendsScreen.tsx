import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  mutual: number;
}

interface FriendRequest {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  mutual: number;
}

const FriendsScreen = () => {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  // Dummy Data
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Sarah Chen', username: '@sarahcodes', avatar: 'https://picsum.photos/id/64/200', mutual: 12 },
    { id: '2', name: 'Rahim Khan', username: '@rahimdev', avatar: 'https://picsum.photos/id/65/200', mutual: 8 },
    { id: '3', name: 'Priya Sharma', username: '@priyaui', avatar: null, mutual: 15 },
    { id: '4', name: 'Alex Rivera', username: '@arivera', avatar: 'https://picsum.photos/id/66/200', mutual: 5 },
  ]);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    { id: 'r1', name: 'Nadia Islam', username: '@nadia_ux', avatar: 'https://picsum.photos/id/67/200', mutual: 3 },
    { id: 'r2', name: 'Tanvir Ahmed', username: '@tanvirhossain', avatar: null, mutual: 7 },
  ]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = friendRequests.filter(req =>
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccept = (id: string) => {
    const request = friendRequests.find(req => req.id === id);
    if (request) {
      setFriends([...friends, { ...request, id: Date.now().toString() }]);
      setFriendRequests(friendRequests.filter(req => req.id !== id));
      Alert.alert('Success', `You are now friends with ${request.name}`);
    }
  };

  const handleReject = (id: string) => {
    setFriendRequests(friendRequests.filter(req => req.id !== id));
  };

  const renderFriendItem = (item: Friend | FriendRequest, isRequest = false) => (
    <View key={item.id} style={styles.friendCard}>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.mutual}>
          {item.mutual} mutual friends
        </Text>
      </View>

      {isRequest ? (
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleReject(item.id)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.messageBtn}>
          <Icon name="chatbubble-outline" size={20} color="#6C5CE7" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            All Friends ({friends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'friends' ? (
          filteredFriends.length > 0 ? (
            filteredFriends.map(friend => renderFriendItem(friend))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No friends found</Text>
            </View>
          )
        ) : (
          filteredRequests.length > 0 ? (
            filteredRequests.map(request => renderFriendItem(request, true))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="mail-open-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F8',
  },
  header: {
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop:42
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  defaultAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  username: {
    fontSize: 14,
    color: '#777',
    marginVertical: 2,
  },
  mutual: {
    fontSize: 12.5,
    color: '#888',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptBtn: {
    backgroundColor: '#6C5CE7',
  },
  rejectBtn: {
    backgroundColor: '#F1F1F1',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  rejectText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  messageBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default FriendsScreen;