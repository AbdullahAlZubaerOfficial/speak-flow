import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  Linking,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const HelpSupport = () => {
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => {
      router.navigate('/(tabs)/profile');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router]);

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Would you like to send us an email?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Email",
          onPress: () => Linking.openURL('mailto:zubaerislam703@gmail.com?subject=Help Request'),
        },
      ]
    );
  };

  const handleFAQ = (question: string) => {
    Alert.alert(question, "Answer will be shown here.\n\nThis is a demo version.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(tabs)/profile')}>
          <Icon name="chevron-back" size={28} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Icon name="help-circle-outline" size={60} color="#6C5CE7" />
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            We're here to assist you with any questions or issues.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quick Support</Text>

          <TouchableOpacity style={styles.card} onPress={handleContactSupport}>
            <View style={styles.cardIcon}>
              <Icon name="mail-outline" size={28} color="#6C5CE7" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Contact Support</Text>
              <Text style={styles.cardSubtitle}>Get help from our team via email</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => Linking.openURL('https://yourapp.com/help')}
          >
            <View style={styles.cardIcon}>
              <Icon name="document-text-outline" size={28} color="#6C5CE7" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Visit Help Center</Text>
              <Text style={styles.cardSubtitle}>Browse detailed guides and tutorials</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Frequently Asked Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>

          <TouchableOpacity style={styles.faqItem} onPress={() => handleFAQ("How do I reset my password?")}>
            <Text style={styles.faqQuestion}>How do I reset my password?</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem} onPress={() => handleFAQ("How to make my account private?")}>
            <Text style={styles.faqQuestion}>How to make my account private?</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem} onPress={() => handleFAQ("Why am I not receiving notifications?")}>
            <Text style={styles.faqQuestion}>Why am I not receiving notifications?</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.faqItem} onPress={() => handleFAQ("How do I delete my account?")}>
            <Text style={styles.faqQuestion}>How do I delete my account?</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* More Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>More Resources</Text>

          <TouchableOpacity style={styles.resourceItem} onPress={() => Alert.alert('Community', 'Join our community forum')}>
            <Icon name="people-outline" size={24} color="#6C5CE7" />
            <Text style={styles.resourceText}>Community Forum</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem} onPress={() => Alert.alert('Report', 'Report a bug or issue')}>
            <Icon name="bug-outline" size={24} color="#6C5CE7" />
            <Text style={styles.resourceText}>Report a Bug</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem} onPress={() => Alert.alert('Feedback', 'Send us your feedback')}>
            <Icon name="thumbs-up-outline" size={24} color="#6C5CE7" />
            <Text style={styles.resourceText}>Send Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Made in Bangladesh</Text>
            <Text style={styles.versionSubtext}>Developer  -  Abdullah Al Zubaer</Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  welcomeCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 24,
    paddingVertical: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 16,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    paddingHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 5,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a2e',
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 18,
    borderRadius: 16,
    gap: 16,
  },
  resourceText: {
    fontSize: 16.5,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 12.5,
    color: '#AAA',
    marginTop: 4,
  },
});

export default HelpSupport;