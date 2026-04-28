import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const callsData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    type: 'video',
    time: '15:23 • 2:45 PM',
    icon: 'videocam',
    isMissed: false,
  },
  {
    id: '2',
    name: 'Mike Chen',
    type: 'audio',
    time: '8:12 • 1:20 PM',
    icon: 'call',
    isMissed: false,
  },
  {
    id: '3',
    name: 'English Study Group',
    type: 'video',
    time: 'Missed • Yesterday',
    icon: 'videocam',
    isMissed: true,
  },
  {
    id: '4',
    name: 'Project Team',
    type: 'audio',
    time: '45:30 • Yesterday',
    icon: 'call',
    isMissed: false,
  },
  {
    id: '5',
    name: 'Emma Watson',
    type: 'video',
    time: '3:10 • Today',
    icon: 'videocam',
    isMissed: false,
  },
  {
    id: '6',
    name: 'David Kim',
    type: 'audio',
    time: 'Missed • 11:45 AM',
    icon: 'call',
    isMissed: true,
  },
];

type TabType = 'all' | 'video' | 'audio';

const CallsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Filter calls based on active tab
  const filteredCalls = useMemo(() => {
    if (activeTab === 'all') return callsData;
    return callsData.filter(call => call.type === activeTab);
  }, [activeTab]);

  const renderCallItem = ({ item }: any) => (
    <TouchableOpacity style={styles.callItem} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar, 
          item.name.includes('Group') && styles.groupAvatar
        ]}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0)}
          </Text>
        </View>

        {/* Type Badge */}
        {item.type === 'video' ? (
          <View style={styles.videoIconBadge}>
            <Icon name="videocam" size={14} color="#fff" />
          </View>
        ) : (
          <View style={styles.audioIconBadge}>
            <Icon name="call" size={14} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.callInfo}>
        <Text style={[styles.name, item.isMissed && styles.missedText]}>
          {item.name}
        </Text>
        <View style={styles.callDetails}>
          <Icon 
            name={item.icon} 
            size={16} 
            color={item.isMissed ? '#FF3B30' : '#34C759'} 
          />
          <Text style={[styles.time, item.isMissed && styles.missedTime]}>
            {item.time}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.callButton}>
        <Icon 
          name={item.icon} 
          size={26} 
          color={item.isMissed ? '#FF3B30' : '#007AFF'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'video' && styles.activeTab]}
          onPress={() => setActiveTab('video')}
        >
          <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}>
            Video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'audio' && styles.activeTab]}
          onPress={() => setActiveTab('audio')}
        >
          <Text style={[styles.tabText, activeTab === 'audio' && styles.activeTabText]}>
            Audio
          </Text>
        </TouchableOpacity>
      </View>



      {/* Recent Section */}
      <Text style={styles.sectionTitle}>
        Recent {activeTab !== 'all' && `(${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)})`}
      </Text>

      <FlatList
        data={filteredCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {activeTab} calls found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    paddingTop: 28,
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
  },

  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  videoButton: {
    backgroundColor: '#007AFF',
  },
  audioButton: {
    backgroundColor: '#8E44FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },

  listContent: {
    paddingBottom: 30,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatar: {
    backgroundColor: '#FF9500',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  videoIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#34C759',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  audioIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  callInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  missedText: {
    color: '#FF3B30',
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: 15,
    color: '#8E8E93',
  },
  missedTime: {
    color: '#FF3B30',
  },
  callButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default CallsScreen;