import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();

  const menuItems = [
      {
      id: 'learn',
      title: 'Learn English',
      icon: 'book',
      color: '#E1306C',
      screen: '/(tabs)/learn',
      description: 'Videos, Books & Vocabulary',
    },
        {
      id: 'tasks',
      title: 'Tasks',
      icon: 'checkbox',
      color: '#FF9500',
      screen: '/(tabs)/tasks',
      description: 'Stay organized',
    },

    {
      id: 'chats',
      title: 'Chats',
      icon: 'chatbubble-ellipses',
      color: '#6C5CE7',
      screen: '/(tabs)/chat',
      description: 'Talk with friends & AI Assistant',
    },
    {
      id: 'calls',
      title: 'Calls',
      icon: 'call',
      color: '#00C853',
      screen: '/(tabs)/call',
      description: 'Voice & Video Calls',
    },

  
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.headerTitle}>SpeakFlow</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#6C5CE7', '#A45EFF']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          
            <Text style={styles.tagline}>
              Master English with Friends, AI & Daily Practice
            </Text>
          </View>
        </LinearGradient>

        {/* Mission & Vision */}
        <View style={styles.missionContainer}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            To make English learning fun, interactive, and accessible for everyone by combining 
            real conversations, smart AI assistance, and structured learning.
          </Text>

          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.missionText}>
            A world where every learner confidently speaks English through meaningful connections 
            and consistent practice.
          </Text>
        </View>

        {/* Quick Access */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.sectionTitle}>What would you like to do today?</Text>

          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={() => router.push(item.screen as any)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                  <Icon name={item.icon} size={32} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Motivation */}
        <View style={styles.motivationCard}>
          <Icon name="sparkles" size={28} color="#FF9500" />
          <Text style={styles.motivationText}>
            "The more you practice, the better you speak."
          </Text>
          <Text style={styles.motivationAuthor}>- SpeakFlow Team</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  /* Fixed Header */
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: '#6C5CE7',
    zIndex: 100,
    paddingTop: StatusBar.currentHeight || 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  /* Scroll Content */
  scrollContent: {
    paddingTop: 110,   // Space for fixed header
  },

  /* Hero Section */
  heroSection: {
    paddingTop: 30,
    paddingBottom: 55,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginVertical: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '88%',
  },

  /* Mission & Vision */
  missionContainer: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 24,
    marginBottom: 10,
  },
  missionText: {
    fontSize: 15.5,
    lineHeight: 24,
    color: '#555',
  },

  /* Quick Access */
  quickAccessContainer: {
    padding: 24,
    paddingTop: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 12,
  },
  menuCard: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  menuDescription: {
    fontSize: 13.5,
    color: '#666',
    lineHeight: 19,
  },

  /* Motivation Card */
  motivationCard: {
    margin: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  motivationText: {
    fontSize: 17,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
    marginVertical: 14,
    lineHeight: 26,
  },
  motivationAuthor: {
    color: '#888',
    fontSize: 14,
  },
});

export default HomeScreen;