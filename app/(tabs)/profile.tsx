import { Link } from 'expo-router';
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

/* ─── types ─────────────────────────────────────────────── */
interface ProfileData {
  name: string;
  email: string;
  photoUri: string | null;
  coverUri: string | null;
  bio: string;
}

/* ─── EditProfileModal ───────────────────────────────────── */
const EditProfileModal = ({
  visible,
  profile,
  onClose,
  onSave,
}: {
  visible: boolean;
  profile: ProfileData;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio || '');
  const [coverUri, setCoverUri] = useState(profile.coverUri);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);

  const slideAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setName(profile.name);
      setEmail(profile.email);
      setBio(profile.bio || '');
      setCoverUri(profile.coverUri);
      setPhotoUri(profile.photoUri);

      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, profile]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library.');
        return false;
      }
    }
    return true;
  };

  const pickImage = async (type: 'profile' | 'cover') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'cover' ? [16, 9] : [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]) {
      if (type === 'cover') {
        setCoverUri(result.assets[0].uri);
      } else {
        setPhotoUri(result.assets[0].uri);
      }
    }
  };

  const takePhoto = async (type: 'profile' | 'cover') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: type === 'cover' ? [16, 9] : [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]) {
      if (type === 'cover') setCoverUri(result.assets[0].uri);
      else setPhotoUri(result.assets[0].uri);
    }
  };

  const showImageOptions = (type: 'profile' | 'cover') => {
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

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        ...profile,
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        coverUri,
        photoUri,
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.modalSheet, { transform: [{ translateY }] }]}>
          <View style={styles.sheetHandle} />

          {/* Cover Photo Section */}
          <View style={styles.editCoverSection}>
            <Image
              source={{ uri: coverUri || 'https://picsum.photos/id/1015/800/300' }}
              style={styles.editCoverImage}
            />
            <TouchableOpacity
              style={styles.editCoverBtn}
              onPress={() => showImageOptions('cover')}
            >
              <Icon name="camera" size={18} color="#fff" />
              <Text style={styles.editCoverBtnText}>Change Cover</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={onClose} style={styles.sheetCloseBtn}>
              <Icon name="close" size={22} color="#666" />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} style={styles.sheetSaveBtn}>
              <Text style={styles.sheetSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarPickerRow}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.modalAvatarImage} />
            ) : (
              <View style={styles.modalAvatar}>
                <Icon name="person" size={48} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.changePhotoBtn} onPress={() => showImageOptions('profile')}>
              <Icon name="camera" size={16} color="#6C5CE7" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.fieldsContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="person-outline" size={20} color="#888" />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor="#bbb"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <View style={[styles.inputWrapper, { height: 90, alignItems: 'flex-start', paddingTop: 12 }]}>
                <Icon name="chatbubble-outline" size={20} color="#888" style={{ marginTop: 4 }} />
                <TextInput
                  style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Write something about yourself..."
                  placeholderTextColor="#bbb"
                  multiline
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color="#888" />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveCTAButton} onPress={handleSave}>
            <Text style={styles.saveCTAText}>Update Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* ─── Main ProfileScreen ─────────────────────────────────── */
const ProfileScreen = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    photoUri: null,
    coverUri: null,
    bio: 'Passionate developer and creator. Love building amazing things! 🚀',
  });

  const stats = [
    { number: '47', label: 'Tasks Done', icon: 'checkmark-circle-outline' },
    { number: '23', label: 'Videos Watched', icon: 'play-circle-outline' },
    { number: '156', label: 'Words Learned', icon: 'book-outline' },
  ];

  const handleSaveProfile = useCallback((updated: ProfileData) => {
    setProfile(updated);
    setEditModalVisible(false);
  }, []);

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5A4BD1" />

      <View style={styles.fixedTop}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: profile.coverUri || 'https://picsum.photos/id/1015/800/300' }}
            style={styles.coverPhoto}
          />
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </View>

        {/* Header Content */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerPageTitle}>.</Text>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity onPress={()=> router.push("/(tabs)/screens/ProfileScreen")} style={styles.viewProfileBtn}>
                <Icon name="eye-outline" size={16} color="#fff" />
                <Text style={styles.viewProfileBtnText}>View Profile</Text>
              </TouchableOpacity>
        
            </View>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.avatarEditBadge}
              onPress={() => setEditModalVisible(true)}
            >
              <Icon name="pencil" size={12} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
            <Icon name="create-outline" size={16} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <View style={styles.statItem}>
                <View style={styles.statIconWrap}>
                  <Icon name={stat.icon as any} size={19} color="#6C5CE7" />
                </View>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {index < stats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.optionRow}>
            <View style={[styles.optionIconWrap, { backgroundColor: '#EEF0FF' }]}>
              <Icon name="notifications-outline" size={20} color="#6C5CE7" />
            </View>
            <Text style={styles.optionText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#B8ADFF' }}
              thumbColor={notificationsEnabled ? '#6C5CE7' : '#fff'}
            />
          </View>

          <Link href="/profile/notifications" asChild>
            <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
              <View style={[styles.optionIconWrap, { backgroundColor: '#FFF0E8' }]}>
                <Icon name="alarm-outline" size={20} color="#E17055" />
              </View>
              <Text style={styles.optionText}>Notification Settings</Text>
              <Icon name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          </Link>

          <View style={styles.optionRow}>
            <View style={[styles.optionIconWrap, { backgroundColor: '#E8F7F0' }]}>
              <Icon name="language-outline" size={20} color="#00B894" />
            </View>
            <Text style={styles.optionText}>Language</Text>
            <Text style={styles.optionValue}>English</Text>
          </View>

          <View style={[styles.optionRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.optionIconWrap, { backgroundColor: '#EEEEFF' }]}>
              <Icon name="moon-outline" size={20} color="#5A4BD1" />
            </View>
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E0E0E0', true: '#B8ADFF' }}
              thumbColor={darkModeEnabled ? '#6C5CE7' : '#fff'}
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push('/(tabs)/profile/privacy-settings')}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: '#FFF0E8' }]}>
              <Icon name="shield-checkmark-outline" size={20} color="#E17055" />
            </View>
            <Text style={styles.optionText}>Privacy Settings</Text>
            <Icon name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/profile/account-settings')}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: '#E8F0FF' }]}>
              <Icon name="settings-outline" size={20} color="#0984E3" />
            </View>
            <Text style={styles.optionText}>Account Settings</Text>
            <Icon name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity
            style={[styles.optionRow, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/(tabs)/profile/help-support')}
          >
            <View style={[styles.optionIconWrap, { backgroundColor: '#E8F7F0' }]}>
              <Icon name="help-circle-outline" size={20} color="#00B894" />
            </View>
            <Text style={styles.optionText}>Help & Support</Text>
            <Icon name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <View style={styles.logoutInner}>
            <Icon name="log-out-outline" size={21} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editModalVisible}
        profile={profile}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
};

/* ─── Styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F8',
  },

  fixedTop: {
    zIndex: 10,
  },

  /* Cover Photo */
  coverContainer: {
    height: 195,
    position: 'relative',
    overflow: 'hidden',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  decorCircle1: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -70,
    right: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: 45,
    left: -35,
  },

  /* Header */
  header: {
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    paddingBottom: 65,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginTop: -68,           // Key fix for proper overlap
  },

  headerTopRow: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerPageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  viewProfileBtnText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '600',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Avatar */
  avatarContainer: {
    marginTop: -48,
    position: 'relative',
    zIndex: 2,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#8A7BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5A4BD1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
  },

  name: {
    fontSize: 23,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  email: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 4,
  },
  bio: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 8,
    lineHeight: 18,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14.5,
  },

  /* Stats Card */
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 10,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 21,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 11.5,
    color: '#888',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 55,
    backgroundColor: '#F0F0F0',
    alignSelf: 'center',
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 16 },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingVertical: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F8',
    gap: 14,
  },
  optionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 15.5,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  optionValue: {
    fontSize: 14,
    color: '#888',
  },

  logoutButton: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFE0DF',
    borderRadius: 18,
  },
  logoutInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 17,
    gap: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16.5,
    fontWeight: '700',
  },

  /* Modal Styles */
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  modalSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 25,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  editCoverSection: {
    height: 160,
    position: 'relative',
  },
  editCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editCoverBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  editCoverBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  sheetSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0EEFF',
    borderRadius: 14,
  },
  sheetSaveText: {
    color: '#6C5CE7',
    fontWeight: '700',
  },

  avatarPickerRow: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  modalAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    gap: 6,
  },
  changePhotoText: {
    color: '#6C5CE7',
    fontWeight: '600',
  },

  fieldsContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#999',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EEEEF8',
    paddingHorizontal: 16,
    height: 54,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15.5,
    color: '#1C1C1E',
  },
  saveCTAButton: {
    marginHorizontal: 20,
    marginTop: 26,
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  saveCTAText: {
    color: '#fff',
    fontSize: 16.5,
    fontWeight: '700',
  },
});

export default ProfileScreen;