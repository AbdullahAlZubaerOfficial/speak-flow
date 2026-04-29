import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const PrivacySettings = () => {
  const router = useRouter();

  // Settings States
  const [settings, setSettings] = useState({
    privateAccount: false,
    showOnlineStatus: true,
    allowMessagesFromEveryone: true,
    allowTags: true,
    dataSharing: false,
    analytics: true,
    darkMode: false,
    notifications: true,
  });

  useEffect(() => {
    const onBackPress = () => {
      router.navigate('/(tabs)/profile');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // Add your logout logic here
            // router.replace('/login');
          }
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    value,
    onToggle,
    showSwitch = true,
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: () => void;
    showSwitch?: boolean;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch && value !== undefined && onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: '#6C5CE7' }}
          thumbColor="#fff"
        />
      )}
      {!showSwitch && (
        <Icon name="chevron-forward" size={22} color="#999" />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('/(tabs)/profile')}>
          <Icon name="chevron-back" size={28} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <SettingItem
            title="Private Account"
            subtitle="Only approved followers can see your posts"
            value={settings.privateAccount}
            onToggle={() => toggleSetting('privateAccount')}
          />
          <SettingItem
            title="Show Online Status"
            subtitle="Let others see when you're active"
            value={settings.showOnlineStatus}
            onToggle={() => toggleSetting('showOnlineStatus')}
          />
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy</Text>
          <SettingItem
            title="Allow Messages from Everyone"
            value={settings.allowMessagesFromEveryone}
            onToggle={() => toggleSetting('allowMessagesFromEveryone')}
          />
          <SettingItem
            title="Allow Tags & Mentions"
            value={settings.allowTags}
            onToggle={() => toggleSetting('allowTags')}
          />
          <SettingItem
            title="Data Sharing"
            subtitle="Share usage data to improve experience"
            value={settings.dataSharing}
            onToggle={() => toggleSetting('dataSharing')}
          />
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <SettingItem
            title="Notifications"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          <SettingItem
            title="Dark Mode"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />
          <SettingItem
            title="Analytics"
            subtitle="Help us improve the app"
            value={settings.analytics}
            onToggle={() => toggleSetting('analytics')}
          />
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support & Legal</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Coming Soon', 'Help Center is under development')}>
            <Text style={styles.settingTitle}>Help Center</Text>
            <Icon name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Coming Soon', 'Terms of Service')}>
            <Text style={styles.settingTitle}>Terms of Service</Text>
            <Icon name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Coming Soon', 'Privacy Policy')}>
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Icon name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 16.5,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  settingSubtitle: {
    fontSize: 13.5,
    color: '#888',
    marginTop: 3,
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 10,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
  },
});

export default PrivacySettings;