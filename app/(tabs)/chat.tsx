import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Alert,
  ScrollView,
  Animated,
  PanResponder,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaItem = {
  id: string;
  type: 'image' | 'file' | 'voice';
  uri?: string;
  name?: string;
  duration?: string;
  durationMs?: number;
  waveform?: number[];
};

type Message = {
  id: string;
  text?: string;
  isMe: boolean;
  time: string;
  media?: MediaItem;
  reactions?: { emoji: string; count: number; reactedByMe?: boolean }[];
  replyTo?: { id: string; text?: string; senderName: string };
};

type Member = {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
};

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
  isAI?: boolean;
  isGroup?: boolean;
  members?: Member[];
  sharedImages?: MediaItem[];
  sharedFiles?: MediaItem[];
  bio?: string;
  phone?: string;
  email?: string;
  profileImage?: string;
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const ALL_CONTACTS: Member[] = [
  { id: 'c1', name: 'Sarah Johnson', avatar: '👩🏻', isOnline: true },
  { id: 'c2', name: 'Mike Chen', avatar: '🧔🏻', isOnline: true },
  { id: 'c3', name: 'Emily Rose', avatar: '👩🏽', isOnline: false },
  { id: 'c4', name: 'David Park', avatar: '👨🏻', isOnline: true },
  { id: 'c5', name: 'Anika Rahman', avatar: '👩🏾', isOnline: false },
  { id: 'c6', name: 'James Lee', avatar: '🧑🏻', isOnline: true },
];

const initialChats: Chat[] = [
  {
    id: '1',
    name: 'AI Chat Assistant',
    avatar: '🤖',
    lastMessage: 'Ask me anything or improve your English',
    time: '',
    isAI: true,
    bio: 'Your smart AI assistant powered by advanced language models.',
    sharedImages: [],
    sharedFiles: [],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '👩🏻',
    lastMessage: 'See you tomorrow at the meeting!',
    time: '2:45 PM',
    unread: 2,
    isOnline: true,
    phone: '+1 555-0102',
    email: 'sarah@example.com',
    bio: 'Product designer at TechCorp 🎨',
    profileImage: 'https://picsum.photos/seed/sarah/400/400',
    sharedImages: [
      { id: 'img1', type: 'image', uri: 'https://picsum.photos/seed/a/400/400', name: 'photo1.jpg' },
      { id: 'img2', type: 'image', uri: 'https://picsum.photos/seed/b/400/400', name: 'photo2.jpg' },
      { id: 'img3', type: 'image', uri: 'https://picsum.photos/seed/c/400/400', name: 'photo3.jpg' },
    ],
    sharedFiles: [
      { id: 'f1', type: 'file', name: 'design-brief.pdf' },
      { id: 'f2', type: 'file', name: 'wireframes.fig' },
    ],
  },
  {
    id: '3',
    name: 'English Study Group',
    avatar: '📚',
    lastMessage: 'John: Thanks for the vocabulary list',
    time: '1:20 PM',
    isGroup: true,
    members: [
      { id: 'c1', name: 'Sarah Johnson', avatar: '👩🏻', isOnline: true },
      { id: 'c2', name: 'Mike Chen', avatar: '🧔🏻', isOnline: true },
    ],
    sharedImages: [],
    sharedFiles: [],
  },
  {
    id: '4',
    name: 'Mike Chen',
    avatar: '🧔🏻',
    lastMessage: 'That sounds great! Let me check my schedule.',
    time: '11:30 AM',
    isOnline: true,
    phone: '+1 555-0104',
    email: 'mike@example.com',
    bio: 'Software engineer & coffee addict ☕',
    profileImage: 'https://picsum.photos/seed/mike/400/400',
    sharedImages: [
      { id: 'img4', type: 'image', uri: 'https://picsum.photos/seed/d/400/400', name: 'screenshot.jpg' },
    ],
    sharedFiles: [
      { id: 'f3', type: 'file', name: 'project-spec.docx' },
    ],
  },
  {
    id: '5',
    name: 'Project Team',
    avatar: '💼',
    lastMessage: 'Emily: Updated the task list',
    time: 'Yesterday',
    unread: 5,
    isGroup: true,
    members: [
      { id: 'c3', name: 'Emily Rose', avatar: '👩🏽', isOnline: false },
      { id: 'c4', name: 'David Park', avatar: '👨🏻', isOnline: true },
    ],
    sharedImages: [],
    sharedFiles: [],
  },
];

const sarahMessages: Message[] = [
  { id: '1', text: "Hey! How are you?", isMe: false, time: "10:30 AM" },
  { id: '2', text: "I'm doing great! Just finished my English lesson.", isMe: true, time: "10:32 AM" },
  { id: '3', text: "That's awesome! What did you learn today?", isMe: false, time: "10:33 AM" },
  { id: '4', text: "We covered present perfect tense and some new vocabulary words.", isMe: true, time: "10:35 AM" },
  {
    id: '5',
    isMe: false,
    time: '10:36 AM',
    media: {
      id: 'demo-voice',
      type: 'voice',
      duration: '0:08',
      durationMs: 8000,
      waveform: [3, 6, 9, 5, 12, 8, 15, 10, 7, 13, 6, 9, 4, 11, 8, 6, 14, 10, 5, 8],
    },
  },
  { id: '6', text: "See you tomorrow at the meeting!", isMe: false, time: "2:45 PM" },
];

const aiQuickPrompts = [
  "Improve my English ✍️",
  "Explain a sentence 🔍",
  "Practice conversation 💬",
  "Check my grammar ✅",
];

const EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '👍', '🔥'];

// Generate random waveform
const generateWaveform = (bars = 30): number[] =>
  Array.from({ length: bars }, () => Math.floor(Math.random() * 14) + 3);

// ─── Image Viewer Modal ───────────────────────────────────────────────────────

const ImageViewerModal = ({
  visible,
  uri,
  onClose,
}: {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
}) => {
  if (!uri) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={imgStyles.overlay}>
          <TouchableOpacity style={imgStyles.closeBtn} onPress={onClose}>
            <Icon name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri }}
            style={imgStyles.fullImage}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const imgStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 54,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});

// ─── Profile Image Viewer Modal ───────────────────────────────────────────────

const ProfileImageModal = ({
  visible,
  chat,
  onClose,
}: {
  visible: boolean;
  chat: Chat | null;
  onClose: () => void;
}) => {
  if (!chat) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={profileImgStyles.overlay}>
          <TouchableOpacity style={profileImgStyles.closeBtn} onPress={onClose}>
            <Icon name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={profileImgStyles.card}>
            {chat.profileImage ? (
              <Image
                source={{ uri: chat.profileImage }}
                style={profileImgStyles.profileImg}
                resizeMode="cover"
              />
            ) : (
              <View style={profileImgStyles.emojiContainer}>
                <Text style={{ fontSize: 80 }}>{chat.avatar}</Text>
              </View>
            )}
            <Text style={profileImgStyles.name}>{chat.name}</Text>
            {chat.bio ? <Text style={profileImgStyles.bio}>{chat.bio}</Text> : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const profileImgStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 54,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImg: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  emojiContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#EDE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  bio: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
});

// ─── Voice Message Player Component ──────────────────────────────────────────

const VoiceMessagePlayer = ({
  media,
  isMe,
}: {
  media: MediaItem;
  isMe: boolean;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-1
  const [currentTime, setCurrentTime] = useState('0:00');
  const soundRef = useRef<Audio.Sound | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const totalDurationMs = media.durationMs ?? 8000;
  const waveform = media.waveform ?? generateWaveform(20);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const formatMs = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    if (isPlaying) {
      // Pause
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      if (progressInterval.current) clearInterval(progressInterval.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    // If we have a real URI, try to play it
    if (media.uri) {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: media.uri },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            const p = status.positionMillis / (status.durationMillis ?? totalDurationMs);
            setProgress(Math.min(p, 1));
            setCurrentTime(formatMs(status.positionMillis));
            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
              setCurrentTime('0:00');
            }
          }
        });
        return;
      } catch (e) {
        // fallback to simulated
      }
    }

    // Simulated playback
    const startTime = Date.now();
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / totalDurationMs, 1);
      setProgress(p);
      setCurrentTime(formatMs(elapsed));
      if (p >= 1) {
        clearInterval(progressInterval.current!);
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime('0:00');
      }
    }, 80);
  };

  const activeBars = Math.floor(progress * waveform.length);

  return (
    <View style={voiceStyles.container}>
      <TouchableOpacity style={[voiceStyles.playBtn, isMe ? voiceStyles.playBtnMe : voiceStyles.playBtnThem]} onPress={togglePlay}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={18} color="#fff" />
      </TouchableOpacity>
      <View style={voiceStyles.waveContainer}>
        <View style={voiceStyles.bars}>
          {waveform.map((h, i) => (
            <View
              key={i}
              style={[
                voiceStyles.bar,
                { height: h * 2 + 4 },
                i < activeBars
                  ? (isMe ? voiceStyles.barActiveMе : voiceStyles.barActiveThem)
                  : (isMe ? voiceStyles.barInactiveMe : voiceStyles.barInactiveThem),
              ]}
            />
          ))}
        </View>
        <Text style={[voiceStyles.time, isMe ? { color: 'rgba(255,255,255,0.7)' } : { color: '#888' }]}>
          {isPlaying ? currentTime : (media.duration ?? '0:00')}
        </Text>
      </View>
    </View>
  );
};

const voiceStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 10,
    minWidth: 180,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnMe: { backgroundColor: 'rgba(255,255,255,0.25)' },
  playBtnThem: { backgroundColor: '#6C5CE7' },
  waveContainer: { flex: 1 },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 36,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  barActiveMе: { backgroundColor: 'rgba(255,255,255,0.95)' },
  barActiveThem: { backgroundColor: '#6C5CE7' },
  barInactiveMe: { backgroundColor: 'rgba(255,255,255,0.35)' },
  barInactiveThem: { backgroundColor: '#C5BEF0' },
  time: {
    fontSize: 10,
    marginTop: 4,
  },
});

// ─── Live Recording UI ────────────────────────────────────────────────────────

const LiveRecordingUI = ({
  waveform,
  duration,
  onSend,
  onCancel,
}: {
  waveform: number[];
  duration: string;
  onSend: () => void;
  onCancel: () => void;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={liveStyles.container}>
      <TouchableOpacity onPress={onCancel} style={liveStyles.cancelBtn}>
        <Icon name="trash-outline" size={22} color="#FF4444" />
      </TouchableOpacity>

      <View style={liveStyles.waveArea}>
        {/* Waveform bars */}
        <View style={liveStyles.barsRow}>
          {waveform.slice(-28).map((h, i) => (
            <Animated.View
              key={i}
              style={[
                liveStyles.liveBar,
                {
                  height: h * 2.2 + 4,
                  opacity: 0.4 + (i / 28) * 0.6,
                  backgroundColor: '#6C5CE7',
                },
              ]}
            />
          ))}
        </View>
        <View style={liveStyles.durationRow}>
          <Animated.View style={[liveStyles.redDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={liveStyles.durationText}>{duration}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onSend} style={liveStyles.sendBtn}>
        <Icon name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const liveStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    gap: 10,
  },
  cancelBtn: {
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
  },
  waveArea: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    gap: 2,
  },
  liveBar: {
    width: 3,
    borderRadius: 2,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  durationText: {
    fontSize: 12,
    color: '#FF4444',
    fontWeight: '700',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

// ─── Swipeable Message Component ─────────────────────────────────────────────

const SwipeableMessage = ({
  item,
  onReply,
  onReact,
  onImagePress,
}: {
  item: Message;
  onReply: (msg: Message) => void;
  onReact: (msgId: string, emoji: string) => void;
  onImagePress: (uri: string) => void;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [showEmojis, setShowEmojis] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
    onPanResponderMove: (_, g) => {
      if (item.isMe && g.dx < 0) translateX.setValue(g.dx);
      if (!item.isMe && g.dx > 0) translateX.setValue(g.dx);
    },
    onPanResponderRelease: (_, g) => {
      if (Math.abs(g.dx) > 60) onReply(item);
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
    },
  });

  return (
    <View>
      {item.replyTo && (
        <View style={[styles.replyPreviewBubble, item.isMe ? { alignSelf: 'flex-end', marginRight: 8 } : { alignSelf: 'flex-start', marginLeft: 8 }]}>
          <Text style={styles.replyPreviewSender}>{item.replyTo.senderName}</Text>
          <Text style={styles.replyPreviewText} numberOfLines={1}>{item.replyTo.text}</Text>
        </View>
      )}

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onLongPress={() => setShowEmojis(true)}
          delayLongPress={400}
        >
          <View style={[styles.messageBubble, item.isMe ? styles.myMessage : styles.theirMessage]}>
            {item.media?.type === 'image' && item.media.uri && (
              <TouchableOpacity onPress={() => onImagePress(item.media!.uri!)}>
                <Image
                  source={{ uri: item.media.uri }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            {item.media?.type === 'voice' && (
              <VoiceMessagePlayer media={item.media} isMe={item.isMe} />
            )}
            {item.media?.type === 'file' && (
              <View style={styles.fileBubble}>
                <Icon name="document-attach" size={22} color={item.isMe ? '#fff' : '#6C5CE7'} />
                <Text style={[styles.fileName, item.isMe && { color: '#fff' }]} numberOfLines={1}>{item.media.name}</Text>
              </View>
            )}
            {item.text ? (
              <Text style={[styles.messageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}>
                {item.text}
              </Text>
            ) : null}
            <Text style={[styles.messageTime, item.isMe ? { color: 'rgba(255,255,255,0.65)' } : {}]}>
              {item.time}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Reactions display */}
      {item.reactions && item.reactions.length > 0 && (
        <View style={[styles.reactionsRow, item.isMe ? { alignSelf: 'flex-end', marginRight: 12 } : { alignSelf: 'flex-start', marginLeft: 12 }]}>
          {item.reactions.map((r, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.reactionChip, r.reactedByMe && styles.reactionChipActive]}
              onPress={() => onReact(item.id, r.emoji)}
            >
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
              {r.count > 1 && <Text style={styles.reactionCount}>{r.count}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Emoji picker popup */}
      {showEmojis && (
        <View style={[styles.emojiPicker, item.isMe ? { alignSelf: 'flex-end', marginRight: 8 } : { alignSelf: 'flex-start', marginLeft: 8 }]}>
          {EMOJI_REACTIONS.map((emoji) => {
            const alreadyReacted = item.reactions?.find(r => r.emoji === emoji && r.reactedByMe);
            return (
              <TouchableOpacity
                key={emoji}
                onPress={() => {
                  onReact(item.id, emoji);
                  setShowEmojis(false);
                }}
                style={[styles.emojiOption, alreadyReacted && styles.emojiOptionActive]}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity onPress={() => setShowEmojis(false)} style={styles.emojiOption}>
            <Icon name="close" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

const ChatApp = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  // Modals
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [imageViewerUri, setImageViewerUri] = useState<string | null>(null);
  const [showProfileImage, setShowProfileImage] = useState(false);

  // Group creation
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [groupAvatar, setGroupAvatar] = useState('👥');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // New chat
  const [newContactName, setNewContactName] = useState('');

  // Reply
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Add member modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberSearchQuery, setAddMemberSearchQuery] = useState('');

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState('0:00');
  const [recordDurationMs, setRecordDurationMs] = useState(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const recordingStartTime = useRef<number>(0);
  const waveformInterval = useRef<NodeJS.Timeout | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showInfoModal) { setShowInfoModal(false); return true; }
      if (selectedChat) { setSelectedChat(null); return true; }
      return false;
    });
    return () => backHandler.remove();
  }, [selectedChat, showInfoModal]);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (waveformInterval.current) clearInterval(waveformInterval.current);
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const currentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const openChat = (chat: Chat) => {
    setSelectedChat(chat);
    setReplyingTo(null);
    if (chat.name === 'Sarah Johnson') {
      setMessages(sarahMessages);
    } else if (chat.isAI) {
      setMessages([
        {
          id: '1',
          text: "Hello! I'm your AI assistant. How can I help you today? 😊",
          isMe: false,
          time: 'Just now',
        },
      ]);
    } else {
      setMessages([]);
    }
  };

  const sendMessage = (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim();
    if (!text && !selectedChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      isMe: true,
      time: currentTime(),
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            text: replyingTo.text,
            senderName: replyingTo.isMe ? 'You' : selectedChat?.name ?? '',
          }
        : undefined,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setReplyingTo(null);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    if (selectedChat?.isAI) {
      setTimeout(() => {
        const aiReply: Message = {
          id: (Date.now() + 1).toString(),
          text: "That's a great point! Let me help you with that. How can I assist further? 🤖",
          isMe: false,
          time: currentTime(),
        };
        setMessages(prev => [...prev, aiReply]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }, 900);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        const imageUri = result.assets[0].uri;
        const newMsg: Message = {
          id: Date.now().toString(),
          isMe: true,
          time: currentTime(),
          media: {
            id: 'm' + Date.now(),
            type: 'image',
            uri: imageUri,
            name: result.assets[0].fileName || 'photo.jpg',
          },
        };
        setMessages(prev => [...prev, newMsg]);
        if (selectedChat) {
          setChats(prev =>
            prev.map(c =>
              c.id === selectedChat.id
                ? { ...c, sharedImages: [...(c.sharedImages ?? []), newMsg.media!] }
                : c
            )
          );
        }
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        const newMsg: Message = {
          id: Date.now().toString(),
          isMe: true,
          time: currentTime(),
          media: { id: 'f' + Date.now(), type: 'file', name: result.name },
        };
        setMessages(prev => [...prev, newMsg]);
        if (selectedChat) {
          setChats(prev =>
            prev.map(c =>
              c.id === selectedChat.id
                ? { ...c, sharedFiles: [...(c.sharedFiles ?? []), newMsg.media!] }
                : c
            )
          );
        }
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (err) { /* user cancelled */ }
  };

  // ── Voice Recording ───────────────────────────────────────────────────────

  const startRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = rec;
      setRecording(rec);
      setIsRecording(true);
      setLiveWaveform([]);
      recordingStartTime.current = Date.now();

      if (waveformInterval.current) clearInterval(waveformInterval.current);
      waveformInterval.current = setInterval(() => {
        const elapsed = Date.now() - recordingStartTime.current;
        const mins = Math.floor(elapsed / 60000);
        const secs = Math.floor((elapsed % 60000) / 1000);
        setRecordDuration(`${mins}:${secs < 10 ? '0' + secs : secs}`);
        setRecordDurationMs(elapsed);
        // Add a new random bar to the live waveform
        setLiveWaveform(prev => [...prev, Math.floor(Math.random() * 14) + 3]);
      }, 150);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecordingAndSend = async () => {
    if (!recordingRef.current) {
      setIsRecording(false);
      return;
    }

    if (waveformInterval.current) {
      clearInterval(waveformInterval.current);
      waveformInterval.current = null;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const capturedDuration = recordDuration;
      const capturedDurationMs = recordDurationMs;
      const capturedWaveform = [...liveWaveform];

      recordingRef.current = null;
      setRecording(null);
      setIsRecording(false);

      if (capturedDurationMs > 500) {
        const waveformData = capturedWaveform.length > 0
          ? capturedWaveform
          : generateWaveform(25);

        const newMsg: Message = {
          id: Date.now().toString(),
          isMe: true,
          time: currentTime(),
          media: {
            id: 'v' + Date.now(),
            type: 'voice',
            duration: capturedDuration,
            durationMs: capturedDurationMs,
            uri: uri ?? undefined,
            waveform: waveformData,
          },
        };
        setMessages(prev => [...prev, newMsg]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }

      setRecordDuration('0:00');
      setRecordDurationMs(0);
      setLiveWaveform([]);

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
    } catch (err) {
      recordingRef.current = null;
      setRecording(null);
      setIsRecording(false);
    }
  };

  const cancelRecording = async () => {
    if (waveformInterval.current) {
      clearInterval(waveformInterval.current);
      waveformInterval.current = null;
    }
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
    }
    setRecording(null);
    setIsRecording(false);
    setRecordDuration('0:00');
    setRecordDurationMs(0);
    setLiveWaveform([]);
  };

  // ── Reactions ─────────────────────────────────────────────────────────────

  const handleReact = (msgId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== msgId) return m;
        const existing = (m.reactions ?? []).find(r => r.emoji === emoji);

        if (existing) {
          if (existing.reactedByMe) {
            // Undo: decrease count or remove
            const newCount = existing.count - 1;
            if (newCount <= 0) {
              return { ...m, reactions: m.reactions!.filter(r => r.emoji !== emoji) };
            }
            return {
              ...m,
              reactions: m.reactions!.map(r =>
                r.emoji === emoji ? { ...r, count: newCount, reactedByMe: false } : r
              ),
            };
          } else {
            // Already exists but not by me — add my reaction
            return {
              ...m,
              reactions: m.reactions!.map(r =>
                r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r
              ),
            };
          }
        }
        // New reaction
        return { ...m, reactions: [...(m.reactions ?? []), { emoji, count: 1, reactedByMe: true }] };
      })
    );
  };

  const startNewChat = () => {
    if (!newContactName.trim()) return;
    const newChat: Chat = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      avatar: '👤',
      lastMessage: 'Say hello!',
      time: 'Now',
      isOnline: true,
      bio: '',
      sharedImages: [],
      sharedFiles: [],
    };
    setChats([...chats.slice(0, 1), newChat, ...chats.slice(1)]);
    setNewContactName('');
    setShowNewChatModal(false);
    openChat(newChat);
  };

  const updateGroupInfo = (field: 'name' | 'avatar', value: string) => {
    if (!selectedChat?.isGroup) return;
    const updatedChat = { ...selectedChat, [field]: value };
    setSelectedChat(updatedChat);
    setChats(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
    Alert.alert('Success', `Group ${field} updated!`);
  };

  const startNewGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    const newGroup: Chat = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      avatar: groupAvatar,
      lastMessage: 'Group created',
      time: 'Now',
      isGroup: true,
      members: selectedMembers,
      sharedImages: [],
      sharedFiles: [],
    };
    setChats(prev => [prev[0], newGroup, ...prev.slice(1)]);
    setNewGroupName('');
    setSelectedMembers([]);
    setGroupAvatar('👥');
    setMemberSearchQuery('');
    setShowNewGroupModal(false);
    openChat(newGroup);
  };

  const addMemberToGroup = (member: Member) => {
    if (!selectedChat?.isGroup) return;
    if (selectedChat.members?.find(m => m.id === member.id)) {
      Alert.alert('Already a member', `${member.name} is already in this group.`);
      return;
    }
    const updated = { ...selectedChat, members: [...(selectedChat.members ?? []), member] };
    setSelectedChat(updated);
    setChats(prev => prev.map(c => (c.id === selectedChat.id ? updated : c)));
    Alert.alert('Added', `${member.name} added to group!`);
    setAddMemberSearchQuery('');
  };

  const toggleSelectMember = (member: Member) => {
    setSelectedMembers(prev =>
      prev.find(m => m.id === member.id)
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
  };

  const filteredContacts = ALL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const filteredAddMembers = ALL_CONTACTS.filter(c =>
    !selectedChat?.members?.find(m => m.id === c.id) &&
    c.name.toLowerCase().includes(addMemberSearchQuery.toLowerCase())
  );

  const sortedChats = [...chats.filter(c => c.isAI), ...chats.filter(c => !c.isAI)];

  // ─── Render ───────────────────────────────────────────────────────────────

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, item.isAI && styles.aiAvatar]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        {item.isOnline && !item.isGroup && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          {item.isAI && <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>}
          {item.isGroup && <View style={styles.groupBadge}><Icon name="people" size={10} color="#fff" /></View>}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.timeText}>{item.time}</Text>
        {!!item.unread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Image Viewer ──────────────────────────────────────────────── */}
      <ImageViewerModal
        visible={!!imageViewerUri}
        uri={imageViewerUri}
        onClose={() => setImageViewerUri(null)}
      />

      {/* ── Profile Image Viewer ──────────────────────────────────────── */}
      <ProfileImageModal
        visible={showProfileImage}
        chat={selectedChat}
        onClose={() => setShowProfileImage(false)}
      />

      {/* ── Chats List ──────────────────────────────────────────────────── */}
      {!selectedChat && (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
            <TouchableOpacity style={styles.newChatBtn} onPress={() => setShowNewChatModal(true)}>
              <Icon name="create-outline" size={24} color="#6C5CE7" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conversations..."
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <FlatList
            data={sortedChats}
            keyExtractor={item => item.id}
            renderItem={renderChatItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          <TouchableOpacity style={styles.floatingButton} onPress={() => setShowNewGroupModal(true)}>
            <Icon name="people" size={26} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {/* ── Chat Detail ─────────────────────────────────────────────────── */}
      {selectedChat && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.chatScreen}>
              {/* Header */}
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
                  <Icon name="arrow-back" size={22} color="#1a1a2e" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatHeaderProfile}
                  onPress={() => setShowInfoModal(true)}
                >
                  {/* Tapping avatar opens profile image viewer */}
                  <TouchableOpacity
                    onPress={() => setShowProfileImage(true)}
                    style={[styles.chatHeaderAvatar, selectedChat.isAI && styles.aiAvatar]}
                  >
                    <Text style={{ fontSize: 20 }}>{selectedChat.avatar}</Text>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
                    <Text style={[
                      styles.chatHeaderStatus,
                      selectedChat.isOnline || selectedChat.isAI ? styles.onlineText : styles.offlineText
                    ]}>
                      {selectedChat.isAI
                        ? '● Always available'
                        : selectedChat.isGroup
                          ? `${selectedChat.members?.length ?? 0} members`
                          : selectedChat.isOnline ? '● Online' : 'Offline'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.chatHeaderActions}>
                  {!selectedChat.isAI && (
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => Alert.alert('Audio Call', `Calling ${selectedChat.name}...`)}
                    >
                      <Icon name="call" size={20} color="#6C5CE7" />
                    </TouchableOpacity>
                  )}
                  {!selectedChat.isAI && (
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => Alert.alert('Video Call', `Video calling ${selectedChat.name}...`)}
                    >
                      <Icon name="videocam" size={22} color="#6C5CE7" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.callBtn} onPress={() => setShowInfoModal(true)}>
                    <Icon name="information-circle-outline" size={24} color="#6C5CE7" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Messages */}
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <SwipeableMessage
                    item={item}
                    onReply={msg => setReplyingTo(msg)}
                    onReact={handleReact}
                    onImagePress={(uri) => setImageViewerUri(uri)}
                  />
                )}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />

              {/* AI Quick Prompts */}
              {selectedChat.isAI && messages.length === 1 && (
                <View style={styles.quickPrompts}>
                  <Text style={styles.quickPromptsLabel}>Quick prompts</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {aiQuickPrompts.map((p, i) => (
                      <TouchableOpacity key={i} style={styles.promptChip} onPress={() => setInputText(p)}>
                        <Text style={styles.promptChipText}>{p}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Reply banner */}
              {replyingTo && (
                <View style={styles.replyBanner}>
                  <View style={styles.replyBannerInner}>
                    <Icon name="return-up-back" size={16} color="#6C5CE7" />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.replyBannerSender}>
                        {replyingTo.isMe ? 'You' : selectedChat.name}
                      </Text>
                      <Text style={styles.replyBannerText} numberOfLines={1}>{replyingTo.text}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setReplyingTo(null)}>
                    <Icon name="close" size={18} color="#888" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Live Recording UI */}
              {isRecording ? (
                <LiveRecordingUI
                  waveform={liveWaveform}
                  duration={recordDuration}
                  onSend={stopRecordingAndSend}
                  onCancel={cancelRecording}
                />
              ) : (
                /* Normal Input bar */
                <View style={styles.inputBar}>
                  <TouchableOpacity style={styles.attachBtn} onPress={pickDocument}>
                    <Icon name="attach" size={22} color="#888" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
                    <Icon name="image-outline" size={22} color="#888" />
                  </TouchableOpacity>

                  <TextInput
                    style={styles.messageInput}
                    placeholder={selectedChat.isAI ? 'Ask me anything...' : 'Type a message...'}
                    placeholderTextColor="#aaa"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                  />

                  {inputText.trim() ? (
                    <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
                      <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.micBtn}
                      onLongPress={startRecording}
                      delayLongPress={100}
                    >
                      <Icon name="mic-outline" size={24} color="#6C5CE7" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}

      {/* ── Info Modal ──────────────────────────────────────────────────── */}
      <Modal visible={showInfoModal} animationType="slide" onRequestClose={() => setShowInfoModal(false)}>
        <SafeAreaView style={styles.infoModal}>
          <View style={styles.infoHeader}>
            <TouchableOpacity onPress={() => setShowInfoModal(false)}>
              <Icon name="arrow-back" size={22} color="#1a1a2e" />
            </TouchableOpacity>
            <Text style={styles.infoTitle}>
              {selectedChat?.isGroup ? 'Group Info' : 'Contact Info'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.infoContent}>
            {/* Avatar - Tappable to show profile image */}
            <TouchableOpacity
              style={[styles.infoAvatar, selectedChat?.isAI && styles.aiAvatar]}
              onPress={() => {
                if (selectedChat?.isGroup) {
                  Alert.prompt('Change Group Avatar', 'Enter an emoji', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: (v) => v && updateGroupInfo('avatar', v) },
                  ], 'plain-text', selectedChat.avatar);
                } else {
                  setShowInfoModal(false);
                  setShowProfileImage(true);
                }
              }}
            >
              <Text style={{ fontSize: 52 }}>{selectedChat?.avatar}</Text>
              {selectedChat?.isGroup && (
                <View style={styles.editAvatarBadge}>
                  <Icon name="pencil" size={12} color="#fff" />
                </View>
              )}
              {!selectedChat?.isGroup && !selectedChat?.isAI && (
                <View style={styles.editAvatarBadge}>
                  <Icon name="eye-outline" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.infoNameContainer}>
              {selectedChat?.isGroup ? (
                <TouchableOpacity onPress={() => {
                  Alert.prompt('Edit Group Name', 'Enter new name', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Save', onPress: (v) => v && updateGroupInfo('name', v) },
                  ], 'plain-text', selectedChat.name);
                }}>
                  <Text style={styles.infoName}>{selectedChat?.name}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.infoName}>{selectedChat?.name}</Text>
              )}
            </View>

            {selectedChat?.isOnline && !selectedChat?.isGroup && (
              <Text style={styles.onlineText}>● Online</Text>
            )}

            {selectedChat?.bio ? (
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>About</Text>
                <Text style={styles.infoValue}>{selectedChat.bio}</Text>
              </View>
            ) : null}

            {selectedChat?.phone && (
              <View style={styles.infoRow}>
                <Icon name="call-outline" size={18} color="#6C5CE7" />
                <Text style={styles.infoValue}>{selectedChat.phone}</Text>
              </View>
            )}
            {selectedChat?.email && (
              <View style={styles.infoRow}>
                <Icon name="mail-outline" size={18} color="#6C5CE7" />
                <Text style={styles.infoValue}>{selectedChat.email}</Text>
              </View>
            )}

            {selectedChat?.isGroup && (
              <View style={styles.infoSection}>
                <View style={styles.infoSectionHeader}>
                  <Text style={styles.infoSectionTitle}>
                    Members ({selectedChat.members?.length ?? 0})
                  </Text>
                  <TouchableOpacity onPress={() => setShowAddMemberModal(true)} style={styles.addMemberBtn}>
                    <Icon name="person-add-outline" size={16} color="#6C5CE7" />
                    <Text style={styles.addMemberText}>Add</Text>
                  </TouchableOpacity>
                </View>
                {(selectedChat.members ?? []).map(member => (
                  <View key={member.id} style={styles.memberRow}>
                    <View style={styles.memberAvatar}>
                      <Text style={{ fontSize: 20 }}>{member.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={[styles.memberStatus, member.isOnline ? styles.onlineText : styles.offlineText]}>
                        {member.isOnline ? '● Online' : 'Offline'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Shared Images - Tappable */}
            {(selectedChat?.sharedImages?.length ?? 0) > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>
                  Shared Images ({selectedChat!.sharedImages!.length})
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedChat!.sharedImages!.map(img => (
                    <TouchableOpacity
                      key={img.id}
                      onPress={() => {
                        setShowInfoModal(false);
                        setImageViewerUri(img.uri ?? null);
                      }}
                    >
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.sharedImage}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {(selectedChat?.sharedFiles?.length ?? 0) > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>
                  Shared Files ({selectedChat!.sharedFiles!.length})
                </Text>
                {selectedChat!.sharedFiles!.map(file => (
                  <View key={file.id} style={styles.sharedFileRow}>
                    <View style={styles.fileIcon}>
                      <Icon name="document-outline" size={20} color="#6C5CE7" />
                    </View>
                    <Text style={styles.sharedFileName}>{file.name}</Text>
                    <Icon name="download-outline" size={20} color="#888" />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── New Chat Modal ──────────────────────────────────────────────── */}
      <Modal visible={showNewChatModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Chat</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contact name"
              placeholderTextColor="#aaa"
              value={newContactName}
              onChangeText={setNewContactName}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowNewChatModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={startNewChat}>
                <Text style={styles.modalConfirmText}>Start Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── New Group Modal ─────────────────────────────────────────────── */}
      <Modal visible={showNewGroupModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Create Group</Text>
            <View style={styles.groupAvatarSection}>
              <Text style={styles.modalSubLabel}>Group Avatar (Emoji)</Text>
              <TextInput
                style={styles.avatarInput}
                placeholder="Enter emoji"
                placeholderTextColor="#aaa"
                value={groupAvatar}
                onChangeText={setGroupAvatar}
                maxLength={2}
              />
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Group name"
              placeholderTextColor="#aaa"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <Text style={styles.modalSubLabel}>Add Members</Text>
            <TextInput
              style={styles.searchInputModal}
              placeholder="Search contacts..."
              placeholderTextColor="#aaa"
              value={memberSearchQuery}
              onChangeText={setMemberSearchQuery}
            />
            <ScrollView style={{ maxHeight: 220 }}>
              {filteredContacts.map(contact => {
                const selected = !!selectedMembers.find(m => m.id === contact.id);
                return (
                  <TouchableOpacity
                    key={contact.id}
                    style={[styles.contactSelectRow, selected && styles.contactSelected]}
                    onPress={() => toggleSelectMember(contact)}
                  >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{contact.avatar}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contactSelectName}>{contact.name}</Text>
                      <Text style={[contact.isOnline ? styles.onlineText : styles.offlineText, { fontSize: 12 }]}>
                        {contact.isOnline ? '● Online' : 'Offline'}
                      </Text>
                    </View>
                    {selected && <Icon name="checkmark-circle" size={22} color="#6C5CE7" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <Text style={styles.selectedCount}>
              {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setShowNewGroupModal(false);
                  setSelectedMembers([]);
                  setMemberSearchQuery('');
                  setGroupAvatar('👥');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={startNewGroup}>
                <Text style={styles.modalConfirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Add Member Modal ──────────────────────────────────────────────── */}
      <Modal visible={showAddMemberModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '70%' }]}>
            <Text style={styles.modalTitle}>Add Member</Text>
            <TextInput
              style={styles.searchInputModal}
              placeholder="Search contacts..."
              placeholderTextColor="#aaa"
              value={addMemberSearchQuery}
              onChangeText={setAddMemberSearchQuery}
            />
            <ScrollView style={{ maxHeight: 300 }}>
              {filteredAddMembers.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactSelectRow}
                  onPress={() => {
                    addMemberToGroup(contact);
                    setShowAddMemberModal(false);
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{contact.avatar}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactSelectName}>{contact.name}</Text>
                    <Text style={[contact.isOnline ? styles.onlineText : styles.offlineText, { fontSize: 12 }]}>
                      {contact.isOnline ? '● Online' : 'Offline'}
                    </Text>
                  </View>
                  <Icon name="person-add-outline" size={20} color="#6C5CE7" />
                </TouchableOpacity>
              ))}
              {filteredAddMembers.length === 0 && (
                <Text style={{ textAlign: 'center', color: '#888', padding: 20 }}>
                  {addMemberSearchQuery ? 'No contacts found' : 'All contacts are already in this group.'}
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCancel, { marginTop: 12 }]}
              onPress={() => { setShowAddMemberModal(false); setAddMemberSearchQuery(''); }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const PURPLE = '#6C5CE7';
const LIGHT_PURPLE = '#EDE9FF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e', letterSpacing: -0.5, paddingTop: 40 },
  newChatBtn: { padding: 6 },

  searchContainer: { paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F7',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 42,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#1a1a2e' },

  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    alignItems: 'center',
  },
  avatarContainer: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAvatar: { backgroundColor: '#1a1a2e' },
  avatarText: { fontSize: 26 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#00C897',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  aiBadge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  aiBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  groupBadge: {
    backgroundColor: PURPLE,
    borderRadius: 6,
    padding: 3,
    marginLeft: 6,
  },
  lastMessage: { fontSize: 14, color: '#888', lineHeight: 18 },
  rightSection: { alignItems: 'flex-end', justifyContent: 'center' },
  timeText: { fontSize: 12, color: '#aaa', marginBottom: 6 },
  unreadBadge: {
    backgroundColor: PURPLE,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  floatingButton: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
  },

  chatScreen: { flex: 1, backgroundColor: '#F7F5FF' },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  backButton: { padding: 6, marginRight: 4 },
  chatHeaderProfile: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  chatHeaderName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  chatHeaderStatus: { fontSize: 12, marginTop: 1 },
  onlineText: { color: '#00C897', fontWeight: '600' },
  offlineText: { color: '#aaa' },
  chatHeaderActions: { flexDirection: 'row', alignItems: 'center' },
  callBtn: {
    padding: 8,
    backgroundColor: LIGHT_PURPLE,
    borderRadius: 10,
    marginLeft: 6,
  },

  messagesList: { padding: 14, paddingBottom: 8 },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 3,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: PURPLE,
    borderBottomRightRadius: 4,
    marginRight: 8,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  myMessageText: { color: '#fff' },
  theirMessageText: { color: '#1a1a2e' },
  messageTime: { fontSize: 10, marginTop: 4, color: 'rgba(0,0,0,0.35)', textAlign: 'right' },
  messageImage: { width: 200, height: 140, borderRadius: 12, marginBottom: 6 },
  fileBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  fileName: { fontSize: 14, color: '#1a1a2e', flex: 1, fontWeight: '500' },

  replyPreviewBubble: {
    backgroundColor: '#E8E4FF',
    borderLeftWidth: 3,
    borderLeftColor: PURPLE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 8,
    marginBottom: 2,
    maxWidth: '75%',
  },
  replyPreviewSender: { fontSize: 11, fontWeight: '700', color: PURPLE },
  replyPreviewText: { fontSize: 12, color: '#555' },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0D9FF',
  },
  replyBannerInner: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  replyBannerSender: { fontSize: 12, fontWeight: '700', color: PURPLE },
  replyBannerText: { fontSize: 12, color: '#555', marginTop: 1 },

  emojiPicker: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center',
  },
  emojiOption: { padding: 6, borderRadius: 16 },
  emojiOptionActive: { backgroundColor: LIGHT_PURPLE },
  reactionsRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
    flexWrap: 'wrap',
    gap: 4,
    marginHorizontal: 8,
  },
  reactionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  reactionChipActive: {
    backgroundColor: LIGHT_PURPLE,
    borderColor: PURPLE,
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { fontSize: 11, color: '#555', marginLeft: 2, fontWeight: '600' },

  quickPrompts: { paddingHorizontal: 14, paddingBottom: 8, backgroundColor: '#F7F5FF' },
  quickPromptsLabel: { fontSize: 11, color: '#aaa', marginBottom: 6, fontWeight: '600', letterSpacing: 0.5 },
  promptChip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0D9FF',
  },
  promptChipText: { fontSize: 13, color: PURPLE, fontWeight: '600' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    gap: 6,
  },
  attachBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F3F3F7',
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a2e',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  infoModal: { flex: 1, backgroundColor: '#FAFAFA' },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  infoContent: { padding: 20, alignItems: 'center' },
  infoAvatar: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PURPLE,
    borderRadius: 12,
    padding: 4,
  },
  infoNameContainer: { alignItems: 'center', marginBottom: 4 },
  infoName: { fontSize: 24, fontWeight: '800', color: '#1a1a2e' },
  infoSection: { width: '100%', marginTop: 24 },
  infoSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoSectionTitle: { fontSize: 13, fontWeight: '800', color: '#aaa', letterSpacing: 1, textTransform: 'uppercase' },
  infoRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 12, gap: 10 },
  infoValue: { fontSize: 15, color: '#1a1a2e', flex: 1 },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_PURPLE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  addMemberText: { color: PURPLE, fontSize: 13, fontWeight: '700' },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  memberStatus: { fontSize: 12, marginTop: 2 },
  sharedImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  sharedFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: LIGHT_PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharedFileName: { flex: 1, fontSize: 14, color: '#1a1a2e', fontWeight: '500' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 34,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', marginBottom: 16 },
  modalSubLabel: { fontSize: 13, fontWeight: '700', color: '#888', marginBottom: 8, marginTop: 8 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E0D9FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  groupAvatarSection: { marginBottom: 8 },
  avatarInput: {
    borderWidth: 1.5,
    borderColor: '#E0D9FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 20,
    color: '#1a1a2e',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
  },
  searchInputModal: {
    borderWidth: 1.5,
    borderColor: '#E0D9FF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 14 },
  modalCancel: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#F3F3F7',
  },
  modalConfirm: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: PURPLE,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  modalCancelText: { fontSize: 16, fontWeight: '700', color: '#555' },
  modalConfirmText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  contactSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    borderRadius: 10,
  },
  contactSelected: { backgroundColor: '#F0ECFF' },
  contactSelectName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  selectedCount: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
    color: PURPLE,
    fontWeight: '700',
  },
});

export default ChatApp;