import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

type Notification = {
  id: string;
  type: 'message' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  image?: string;
  username?: string;
};

const getIcon = (type: string) => {
  switch (type) {
    case 'message': return 'chatbubble-ellipses';
    case 'like': return 'heart';
    case 'follow': return 'person-add';
    case 'mention': return 'at';
    case 'system': return 'notifications';
    default: return 'notifications';
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'message': return '#6C5CE7';
    case 'like': return '#FF3B30';
    case 'follow': return '#00C897';
    case 'mention': return '#FF9500';
    case 'system': return '#8E8E93';
    default: return '#666';
  }
};

const NotificationItem = ({ 
  item, 
  onMarkAsRead, 
  onDelete 
}: { 
  item: Notification; 
  onMarkAsRead: (id: string) => void; 
  onDelete: (id: string) => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.notifContainer, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity
        style={[styles.notification, !item.read && styles.unread]}
        onPress={() => onMarkAsRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.leftSection}>
          {item.avatar ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
          ) : (
            <View style={[styles.iconCircle, { backgroundColor: getIconColor(item.type) + '15' }]}>
              <Icon name={getIcon(item.type)} size={26} color={getIconColor(item.type)} />
            </View>
          )}

          <View style={styles.content}>
            <Text style={styles.title}>
              <Text style={styles.bold}>{item.title}</Text>
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>

        {item.image && (
          <Image source={{ uri: item.image }} style={styles.notifImage} />
        )}

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/profile');
      return true; // Prevents default back button behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove();
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'Sarah Johnson',
      message: 'Hey! Are we still meeting tomorrow?',
      time: '2m ago',
      read: false,
      avatar: '👩🏻',
    },
    {
      id: '2',
      type: 'like',
      title: 'Mike Chen liked your photo',
      message: 'Your sunset photo got 12 likes',
      time: '15m ago',
      read: false,
      avatar: '🧔🏻',
      image: 'https://picsum.photos/seed/sunset/200',
    },
    {
      id: '3',
      type: 'follow',
      title: 'Anika Rahman started following you',
      message: 'Say hi to your new follower!',
      time: '1h ago',
      read: true,
      avatar: '👩🏾',
    },
    {
      id: '4',
      type: 'mention',
      title: 'You were mentioned',
      message: '@you What do you think about this design?',
      time: '3h ago',
      read: true,
      avatar: '👨🏻',
    },
    {
      id: '5',
      type: 'system',
      title: 'App Update Available',
      message: 'Version 2.4.1 is now available with new features',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '6',
      type: 'like',
      title: 'Emily Rose liked your comment',
      message: '"This is amazing!"',
      time: 'Yesterday',
      read: true,
      avatar: '👩🏽',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' || !n.read
  );

  const groupedNotifications = {
    Today: filteredNotifications.filter(n => !n.time.includes('Yesterday')),
    Yesterday: filteredNotifications.filter(n => n.time.includes('Yesterday')),
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    Alert.alert('Delete', 'Delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        },
      },
    ]);
  };

  const hasUnread = notifications.some(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Improved Back Handler
  const handleBack = () => {
    router.replace('/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header with increased paddingTop */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-back" size={28} color="#1a1a2e" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={styles.headerRight}>
          {hasUnread && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
              <Icon name="checkmark-done-outline" size={24} color="#6C5CE7" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.activeFilter]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, filter === 'unread' && styles.activeBadge]}>
              <Text style={[styles.badgeText, filter === 'unread' && styles.activeBadgeText]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={Object.entries(groupedNotifications).flatMap(([section, items]) =>
          items.length > 0 ? [{ section, data: items }] : []
        )}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionHeader}>{item.section}</Text>
            {item.data.map((notif: Notification) => (
              <NotificationItem
                key={notif.id}
                item={notif}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="notifications-off-outline" size={50} color="#6C5CE7" />
            </View>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubText}>You're all caught up for now!</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 55 : 30,   // Increased paddingTop
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  markAllBtn: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  activeFilter: {
    backgroundColor: '#1a1a2e',
    borderColor: '#1a1a2e',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#FFEEEE',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#FF3B30',
  },
  badgeText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '700',
  },
  activeBadgeText: {
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  notifContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 20,
  },
  unread: {
    backgroundColor: '#F8F9FF',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 26,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    paddingRight: 8,
    paddingTop: 2,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1a1a2e',
  },
  bold: {
    fontWeight: '700',
  },
  message: {
    fontSize: 14.5,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 8,
    fontWeight: '500',
  },
  notifImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 12,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6C5CE7',
    position: 'absolute',
    top: 20,
    right: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  emptySubText: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
  },
});

export default NotificationsScreen;