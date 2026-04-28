import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const stats = [
    { number: '47', label: 'Tasks Done' },
    { number: '23', label: 'Videos Watched' },
    { number: '156', label: 'Words Learned' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={50} color="#fff" />
            </View>
          </View>

          <Text style={styles.name}>Alex Thompson</Text>
          <Text style={styles.email}>alex.thompson@email.com</Text>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="notifications-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: '#6C5CE7' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="language-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Language</Text>
            </View>
            <Text style={styles.optionValue}>English</Text>
          </View>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="moon-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#ccc', true: '#6C5CE7' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="shield-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Privacy Settings</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="settings-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Account Settings</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon name="help-circle-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Help & Support</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    backgroundColor: '#6C5CE7',
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    paddingVertical: 12,
    paddingLeft: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  optionValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 30,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ProfileScreen;