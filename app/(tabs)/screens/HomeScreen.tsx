import { Ionicons } from '@expo/vector-icons';
import { Globe, Users, ThumbsUp, Heart, Laugh, Frown, Angry, AlertCircle, MessageCircle, Share2, Mail, BookmarkPlus, EyeOff, Flag, Send, Link, MoreHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Share,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ───────────────────────────────────────────────
const ACTIVE_USER_IDS = ['1', '3', '4'];



const USERS_PROFILES: Record<string, UserProfile> = {
    '1': {
        id: '1', name: 'Anika Rahman', username: '@anika_rahman', initials: 'AR',
        avatarBg: '#E6F1FB', avatarCol: '#185FA5',
        coverPhoto: 'https://picsum.photos/id/104/800/400',
        bio: 'Digital creator | Travel enthusiast ✈️ | Living life one moment at a time 🌸',
        location: 'Dhaka, Bangladesh', followers: 1243, following: 856, postsCount: 48,
        isFriend: false, friendRequestSent: false,
    },
    '2': {
        id: '2', name: 'Mehedi Hasan', username: '@mehedi_h', initials: 'MH',
        avatarBg: '#E1F5EE', avatarCol: '#0F6E56',
        coverPhoto: 'https://picsum.photos/id/26/800/400',
        bio: 'Software Engineer | Building cool stuff 🚀 | Open source contributor',
        location: 'Dhaka, Bangladesh', followers: 3421, following: 234, postsCount: 124,
        isFriend: true, friendRequestSent: false,
    },
    '3': {
        id: '3', name: 'Tasnim Islam', username: '@tasnim_art', initials: 'TI',
        avatarBg: '#FBEAF0', avatarCol: '#993556',
        coverPhoto: 'https://picsum.photos/id/106/800/400',
        bio: 'Artist & Designer 🎨 | Capturing beauty in everything ✨',
        location: 'Chittagong, Bangladesh', followers: 2890, following: 456, postsCount: 207,
        isFriend: false, friendRequestSent: false,
    },
    '4': {
        id: '4', name: 'Sabbir Ahmed', username: '@sabbir_a', initials: 'SA',
        avatarBg: '#EAF3DE', avatarCol: '#3B6D11',
        coverPhoto: 'https://picsum.photos/id/42/800/400',
        bio: 'Food lover 🍜 | Photography 📸 | Exploring the world 🌍',
        location: 'Sylhet, Bangladesh', followers: 876, following: 432, postsCount: 89,
        isFriend: false, friendRequestSent: false,
    },
};

const INITIAL_COMMENTS: Record<string, Comment[]> = {
    '1': [
        { id: 'c1', name: 'Rafi Khan', initials: 'RK', bg: '#E6F1FB', col: '#185FA5', text: 'This place looks absolutely magical! Where is it? 😍', time: '1h ago' },
        { id: 'c2', name: 'Sabbir Ahmed', initials: 'SA', bg: '#EAF3DE', col: '#3B6D11', text: 'You always find the best spots! Need to join next time 🙌', time: '1h ago' },
        { id: 'c3', name: 'Nadia Islam', initials: 'NI', bg: '#FAEEDA', col: '#854F0B', text: 'The lighting is just perfect here. Gorgeous shot!', time: '45m ago' },
        { id: 'c4', name: 'Arif Hossain', initials: 'AH', bg: '#FAECE7', col: '#993C1D', text: 'Wow what a view 😮', time: '30m ago' },
        { id: 'c5', name: 'Sadia Jahan', initials: 'SJ', bg: '#EEEDFE', col: '#534AB7', text: 'This is giving me major wanderlust vibes 💙', time: '20m ago' },
        { id: 'c6', name: 'Tanvir Alam', initials: 'TA', bg: '#FBEAF0', col: '#993556', text: 'Amazing capture! The colors are unreal.', time: '10m ago' },
        { id: 'c7', name: 'Mim Rahman', initials: 'MR', bg: '#E1F5EE', col: '#0F6E56', text: 'Please take me with you next time!! 😭', time: '5m ago' },
    ],
    '2': [
        { id: 'c8', name: 'Tasnim Islam', initials: 'TI', bg: '#FBEAF0', col: '#993556', text: 'Congratulations! You deserve this so much 🎉', time: '4h ago' },
        { id: 'c9', name: 'Anika Rahman', initials: 'AR', bg: '#E6F1FB', col: '#185FA5', text: 'So proud of you and the whole team! 🔥', time: '4h ago' },
        { id: 'c10', name: 'Rafi Khan', initials: 'RK', bg: '#E6F1FB', col: '#185FA5', text: 'Legend behavior. Inspired by this post honestly.', time: '3h ago' },
        { id: 'c11', name: 'Karim Uddin', initials: 'KU', bg: '#EAF3DE', col: '#3B6D11', text: 'Would love to hear more! Drop a link? 👀', time: '1h ago' },
    ],
    '3': [
        { id: 'c12', name: 'Mehedi Hasan', initials: 'MH', bg: '#E1F5EE', col: '#0F6E56', text: 'Dhaka really has this golden magic 🌅', time: '23h ago' },
        { id: 'c13', name: 'Sabbir Ahmed', initials: 'SA', bg: '#EAF3DE', col: '#3B6D11', text: 'My city 🖤 Never looked this beautiful', time: '22h ago' },
        { id: 'c14', name: 'Arif Hossain', initials: 'AH', bg: '#FAECE7', col: '#993C1D', text: 'Which rooftop was this? The view is insane!', time: '20h ago' },
        { id: 'c15', name: 'Sadia Jahan', initials: 'SJ', bg: '#EEEDFE', col: '#534AB7', text: 'This could be a postcard honestly 😍', time: '18h ago' },
        { id: 'c16', name: 'Puja Das', initials: 'PD', bg: '#FCEBEB', col: '#A32D2D', text: 'Absolutely breathtaking 🌅', time: '2h ago' },
    ],
    '4': [],
    '5': [],
};

const INITIAL_POSTS: Post[] = [
    {
        id: '1', userId: '1', name: 'Anika Rahman', initials: 'AR',
        avatarBg: '#E6F1FB', avatarCol: '#185FA5', time: '2 hours ago', audience: 'public',
        text: "Sometimes the best moments are the ones you don't plan. Wandered into this spot by accident and now I never want to leave.",
        image: 'https://picsum.photos/id/1015/600/400',
        reactions: { 'like': 80, 'love': 35, 'wow': 13 }, shares: 18, userReaction: null,
    },
    {
        id: '2', userId: '2', name: 'Mehedi Hasan', initials: 'MH',
        avatarBg: '#E1F5EE', avatarCol: '#0F6E56', time: '5 hours ago', audience: 'friends',
        text: 'Just shipped the biggest feature of my career. Three months of sleepless nights — totally worth it. If you believe in something, keep building.',
        image: null, reactions: { 'love': 200, 'like': 141 }, shares: 54, userReaction: 'love',
    },
    {
        id: '3', userId: '3', name: 'Tasnim Islam', initials: 'TI',
        avatarBg: '#FBEAF0', avatarCol: '#993556', time: 'Yesterday', audience: 'public',
        text: 'Dhaka at golden hour hits differently.',
        image: 'https://picsum.photos/id/1040/600/400',
        reactions: { 'wow': 300, 'love': 212 }, shares: 77, userReaction: null,
    },
    {
        id: '4', userId: '3', name: 'Tasnim Islam', initials: 'TI',
        avatarBg: '#FBEAF0', avatarCol: '#993556', time: '2 days ago', audience: 'public',
        text: "Working on a new piece for the exhibition next month. Can't wait to share the final result!",
        image: 'https://picsum.photos/id/30/600/400',
        reactions: { 'love': 95, 'like': 42, 'wow': 18 }, shares: 12, userReaction: null,
    },
    {
        id: '5', userId: '4', name: 'Sabbir Ahmed', initials: 'SA',
        avatarBg: '#EAF3DE', avatarCol: '#3B6D11', time: '3 days ago', audience: 'public',
        text: 'Best biryani in town! Anyone wants to join next food adventure?',
        image: 'https://picsum.photos/id/127/600/400',
        reactions: { 'haha': 56, 'like': 34, 'love': 12 }, shares: 8, userReaction: null,
    },
];

const REACTIONS = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
const REACTION_LABELS: Record<string, string> = {
    'like': 'Like', 'love': 'Love', 'haha': 'Haha', 'wow': 'Wow', 'sad': 'Sad', 'angry': 'Angry',
};
const REACTION_COLORS: Record<string, string> = {
    'like': '#1877F2', 'love': '#F33E58', 'haha': '#F7B928', 'wow': '#F7B928', 'sad': '#F7B928', 'angry': '#E9710F',
};
const ReactionIcon = ({ reaction, size = 20, color }: { reaction: string; size?: number; color?: string }) => {
    const col = color ?? REACTION_COLORS[reaction] ?? '#65676B';
    switch (reaction) {
        case 'like':  return <ThumbsUp size={size} color={col} />;
        case 'love':  return <Heart size={size} color={col} />;
        case 'haha':  return <Laugh size={size} color={col} />;
        case 'wow':   return <AlertCircle size={size} color={col} />;
        case 'sad':   return <Frown size={size} color={col} />;
        case 'angry': return <Angry size={size} color={col} />;
        default:      return <ThumbsUp size={size} color={col} />;
    }
};
const AudienceIcon = ({ audience }: { audience: string }) => {
    if (audience === 'friends') return <Users size={12} color="#65676B" />;
    return <Globe size={12} color="#65676B" />;
};

// ─── Types ──────────────────────────────────────────────
type Comment = { id: string; name: string; initials: string; bg: string; col: string; text: string; time: string };
type Post = {
    id: string; userId: string; name: string; initials: string; avatarBg: string; avatarCol: string;
    time: string; audience: 'public' | 'friends'; text: string; image: string | null;
    reactions: Record<string, number>; shares: number; userReaction: string | null;
};
type UserProfile = {
    id: string; name: string; username: string; initials: string; avatarBg: string; avatarCol: string;
    coverPhoto: string; bio: string; location: string; followers: number; following: number;
    postsCount: number; isFriend: boolean; friendRequestSent: boolean;
};

// ─── Image Viewer Modal ───────────────────────────────────
const ImageViewerModal = ({ visible, imageUri, onClose }: { visible: boolean; imageUri: string | null; onClose: () => void }) => {
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const scale = Math.min(SCREEN_WIDTH / (imageWidth || 1), SCREEN_HEIGHT / (imageHeight || 1));

    React.useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (width, height) => {
                setImageWidth(width);
                setImageHeight(height);
            }, (error) => {
                console.log('Error getting image size:', error);
                setImageWidth(SCREEN_WIDTH);
                setImageHeight(SCREEN_HEIGHT);
            });
        }
    }, [imageUri]);

    const saveImageToGallery = async () => {
        if (!imageUri) return;
        
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant permission to save images to your gallery');
                return;
            }

            const filename = `speakflow_${Date.now()}.jpg`;
            const destination = new FileSystem.File(FileSystem.Paths.document, filename);
            
            await FileSystem.File.downloadFileAsync(imageUri, destination);
            const asset = await MediaLibrary.createAssetAsync(destination.uri);
            await MediaLibrary.createAlbumAsync('SpeakFlow', asset, false);
            
            Alert.alert('Success', 'Image saved to gallery!');
        } catch (error) {
            console.log('Error saving image:', error);
            Alert.alert('Error', 'Failed to save image');
        }
    };

    const shareImage = async () => {
        if (!imageUri) return;
        try {
            await Share.share({
                message: 'Check out this post on SpeakFlow!',
                url: imageUri,
            });
        } catch (error) {
            console.log('Error sharing image:', error);
        }
    };

    if (!visible || !imageUri) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={s.imageViewerOverlay} onPress={onClose}>
                <View style={s.imageViewerContainer}>
                    <TouchableOpacity style={s.imageViewerClose} onPress={onClose}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <View style={s.imageViewerActions}>
                        <TouchableOpacity style={s.imageViewerAction} onPress={shareImage}>
                            <Ionicons name="share-outline" size={24} color="#fff" />
                            <Text style={s.imageViewerActionText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.imageViewerAction} onPress={saveImageToGallery}>
                            <Ionicons name="download-outline" size={24} color="#fff" />
                            <Text style={s.imageViewerActionText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <Image 
                        source={{ uri: imageUri }} 
                        style={[
                            s.imageViewerImage,
                            {
                                width: SCREEN_WIDTH * 0.9,
                                height: Math.min(SCREEN_HEIGHT * 0.7, (SCREEN_WIDTH * 0.9) * (imageHeight / imageWidth)),
                            }
                        ]}
                        resizeMode="contain"
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

// ─── Post Options Menu ───────────────────────────────────
const PostOptionsMenu = ({
    visible, onClose, onShare, onSave, onReport, onHide,
}: {
    visible: boolean; onClose: () => void; onShare: () => void;
    onSave: () => void; onReport: () => void; onHide: () => void;
}) => {
    const OPTIONS = [
        { icon: 'arrow-redo-outline' as const, label: 'Share post', action: onShare },
        { icon: 'bookmark-outline' as const, label: 'Save post', action: onSave },
        { icon: 'eye-off-outline' as const, label: 'Hide post', action: onHide },
        { icon: 'flag-outline' as const, label: 'Report post', action: onReport },
    ];
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={s.overlay} onPress={onClose} />
            <View style={s.optionsSheet}>
                <View style={s.sheetHandle} />
                <Text style={[s.sheetTitle, { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }]}>Post options</Text>
                {OPTIONS.map((opt) => (
                    <TouchableOpacity key={opt.label} style={s.optionItem} onPress={() => { opt.action(); onClose(); }}>
                        <View style={s.optionIconWrap}>
                            <Ionicons name={opt.icon} size={22} color="#050505" />
                        </View>
                        <Text style={s.optionLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={[s.optionItem, { marginBottom: 24 }]} onPress={onClose}>
                    <View style={s.optionIconWrap}>
                        <Ionicons name="close-circle-outline" size={22} color="#65676B" />
                    </View>
                    <Text style={[s.optionLabel, { color: '#65676B' }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};



// ─── Reaction Picker ─────────────────────────────────────
const ReactionPicker = ({ visible, onSelect, onClose }: {
    visible: boolean; onSelect: (r: string) => void; onClose: () => void;
}) => {
    if (!visible) return null;
    return (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <View style={s.reactPicker}>
                {REACTIONS.map((r) => (
                    <TouchableOpacity key={r} onPress={() => onSelect(r)} style={s.reactOpt}>
                        <ReactionIcon reaction={r} size={28} />
                    </TouchableOpacity>
                ))}
            </View>
        </Pressable>
    );
};

// ─── Comment Sheet ───────────────────────────────────────
const CommentSheet = ({
    postId, visible, onClose, comments, onAddComment,
}: {
    postId: string | null;
    visible: boolean;
    onClose: () => void;
    comments: Comment[];
    onAddComment: (postId: string, text: string) => void;
}) => {
    const [showAll, setShowAll] = useState(false);
    const [input, setInput] = useState('');
    const scrollRef = useRef<ScrollView>(null);
    const PREVIEW = 3;

    React.useEffect(() => {
        setShowAll(false);
        setInput('');
    }, [postId]);

    React.useEffect(() => {
        if (visible && comments.length > 0) {
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
        }
    }, [comments.length, visible]);

    const displayed = showAll ? comments : comments.slice(0, PREVIEW);

    const submit = () => {
        if (!input.trim() || !postId) return;
        onAddComment(postId, input.trim());
        setInput('');
        setShowAll(true);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={s.overlay} onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={s.sheet}
            >
                <View style={s.sheetHandle} />
                <View style={s.sheetHeader}>
                    <Text style={s.sheetTitle}>
                        {comments.length} comment{comments.length !== 1 ? 's' : ''}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#65676B" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 16 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {comments.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                            <Ionicons name="chatbubble-outline" size={48} color="#D0D4DB" />
                            <Text style={{ color: '#65676B', marginTop: 14, fontSize: 15, fontWeight: '600' }}>No comments yet</Text>
                            <Text style={{ color: '#9EA3AE', marginTop: 4, fontSize: 13 }}>Be the first to comment!</Text>
                        </View>
                    ) : (
                        <>
                            {displayed.map((c) => (
                                <View key={c.id} style={s.commentRow}>
                                    <View style={[s.commentAvatar, { backgroundColor: c.bg }]}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: c.col }}>{c.initials}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={s.commentBubble}>
                                            <Text style={s.commentName}>{c.name}</Text>
                                            <Text style={s.commentText}>{c.text}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 8, marginTop: 4, alignItems: 'center' }}>
                                            <Text style={s.commentTime}>{c.time}</Text>
                                            <Text style={s.commentAction}>Like</Text>
                                            <Text style={s.commentAction}>Reply</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            {!showAll && comments.length > PREVIEW && (
                                <TouchableOpacity onPress={() => setShowAll(true)} style={{ paddingVertical: 10 }}>
                                    <Text style={{ color: '#1877F2', fontSize: 14, fontWeight: '500' }}>
                                        View {comments.length - PREVIEW} more comment{comments.length - PREVIEW !== 1 ? 's' : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </ScrollView>

                <View style={s.commentInputRow}>
                    <View style={[s.commentAvatar, { backgroundColor: '#E6F1FB' }]}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#185FA5' }}>YO</Text>
                    </View>
                    <TextInput
                        style={s.commentInput}
                        placeholder="Write a comment..."
                        placeholderTextColor="#9EA3AE"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={submit}
                        returnKeyType="send"
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        onPress={submit}
                        disabled={!input.trim()}
                        style={[s.sendBtn, { backgroundColor: input.trim() ? '#1877F2' : '#B0C4DE' }]}
                    >
                        <Ionicons name="send" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// ─── Share Sheet ─────────────────────────────────────────
const ShareSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    type ShareOpt = { Icon: React.ComponentType<{ size: number; color: string }>; color: string; label: string };
    const SHARE_OPTIONS: ShareOpt[] = [
        { Icon: Send,         color: '#1877F2', label: 'Message' },
        { Icon: BookmarkPlus, color: '#E1306C', label: 'Save' },
        { Icon: Link,         color: '#6B4EFF', label: 'Copy link' },
        { Icon: Mail,         color: '#00C853', label: 'Email' },
        { Icon: EyeOff,       color: '#FF9500', label: 'Hide' },
        { Icon: Flag,         color: '#FF3B30', label: 'Report' },
        { Icon: Share2,       color: '#5856D6', label: 'Share' },
        { Icon: MoreHorizontal, color: '#65676B', label: 'More' },
    ];
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={s.overlay} onPress={onClose} />
            <View style={s.shareSheet}>
                <View style={s.sheetHandle} />
                <Text style={[s.sheetTitle, { textAlign: 'center', marginTop: 12, marginBottom: 16 }]}>Share post</Text>
                <View style={s.shareGrid}>
                    {SHARE_OPTIONS.map((opt) => (
                        <TouchableOpacity key={opt.label} style={s.shareItem} onPress={onClose}>
                            <View style={[s.shareIcon, { backgroundColor: opt.color + '18' }]}>
                                <opt.Icon size={24} color={opt.color} />
                            </View>
                            <Text style={s.shareLabel}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={s.copyLink} onPress={onClose}>
                    <Text style={{ fontSize: 13, color: '#65676B' }}>speakflow.app/post/12345</Text>
                    <Text style={{ fontSize: 13, color: '#1877F2', fontWeight: '500' }}>Copy</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

// ─── User Profile Screen ─────────────────────────────────
const UserProfileScreen = ({
    userId, onBack, onUpdateFriendStatus, allPosts, allComments, onReact, onOpenComments, onShare,
}: {
    userId: string; onBack: () => void;
    onUpdateFriendStatus: (userId: string, isFriend: boolean, requestSent: boolean) => void;
    allPosts: Post[];
    allComments: Record<string, Comment[]>;
    onReact: (postId: string, reaction: string) => void;
    onOpenComments: (postId: string) => void;
    onShare: () => void;
}) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const isActive = ACTIVE_USER_IDS.includes(userId);

    React.useEffect(() => {
        const userProfile = USERS_PROFILES[userId];
        if (userProfile) {
            setProfile({ ...userProfile });
            setUserPosts(allPosts.filter(p => p.userId === userId));
        }
        setLoading(false);
    }, [userId, allPosts]);

    const handleFriendRequest = () => {
        if (!profile) return;
        if (profile.isFriend) {
            setProfile({ ...profile, isFriend: false, friendRequestSent: false });
            onUpdateFriendStatus(userId, false, false);
        } else if (profile.friendRequestSent) {
            setProfile({ ...profile, friendRequestSent: false });
            onUpdateFriendStatus(userId, false, false);
        } else {
            setProfile({ ...profile, friendRequestSent: true });
            onUpdateFriendStatus(userId, false, true);
        }
    };

    if (loading || !profile) {
        return (
            <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#1877F2" />
            </View>
        );
    }

    return (
        <View style={s.container}>
            <View style={s.profileHeader}>
                <TouchableOpacity onPress={onBack} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#050505" />
                </TouchableOpacity>
                <Text style={s.profileHeaderTitle}>{profile.name}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: profile.coverPhoto }} style={s.coverPhoto} />

                <View style={s.profileAvatarContainer}>
                    <View style={[s.profileAvatar, { backgroundColor: profile.avatarBg }]}>
                        <Text style={[s.profileAvatarText, { color: profile.avatarCol }]}>{profile.initials}</Text>
                    </View>
                    {isActive && (
                        <View style={s.profileActiveDot}>
                            <View style={s.profileActiveDotInner} />
                        </View>
                    )}
                </View>

                <View style={s.profileInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={s.profileName}>{profile.name}</Text>
                        {isActive && (
                            <View style={s.activeChip}>
                                <View style={s.activeChipDot} />
                                <Text style={s.activeChipText}>Active now</Text>
                            </View>
                        )}
                    </View>
                    <Text style={s.profileUsername}>{profile.username}</Text>
                    <Text style={s.profileBio}>{profile.bio}</Text>
                    <View style={s.profileLocation}>
                        <Ionicons name="location-outline" size={14} color="#65676B" />
                        <Text style={s.locationText}>{profile.location}</Text>
                    </View>

                    <View style={s.profileStats}>
                        <View style={s.statItem}>
                            <Text style={s.statNumber}>{profile.postsCount}</Text>
                            <Text style={s.statLabel}>Posts</Text>
                        </View>
                        <View style={s.statDivider} />
                        <View style={s.statItem}>
                            <Text style={s.statNumber}>{profile.followers.toLocaleString()}</Text>
                            <Text style={s.statLabel}>Followers</Text>
                        </View>
                        <View style={s.statDivider} />
                        <View style={s.statItem}>
                            <Text style={s.statNumber}>{profile.following.toLocaleString()}</Text>
                            <Text style={s.statLabel}>Following</Text>
                        </View>
                    </View>

                    <View style={s.profileActions}>
                        {profile.isFriend ? (
                            <>
                                <TouchableOpacity style={[s.actionButton, s.messageButton]}>
                                    <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                                    <Text style={s.messageButtonText}>Message</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[s.actionButton, s.friendButton]} onPress={handleFriendRequest}>
                                    <Ionicons name="people-outline" size={18} color="#65676B" />
                                    <Text style={s.friendButtonText}>Friends</Text>
                                </TouchableOpacity>
                            </>
                        ) : profile.friendRequestSent ? (
                            <TouchableOpacity style={[s.actionButton, s.requestSentButton]} onPress={handleFriendRequest}>
                                <Ionicons name="time-outline" size={18} color="#65676B" />
                                <Text style={s.requestSentText}>Request Sent</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[s.actionButton, s.addFriendButton]} onPress={handleFriendRequest}>
                                <Ionicons name="person-add-outline" size={18} color="#fff" />
                                <Text style={s.addFriendText}>Add Friend</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={s.profilePostsSection}>
                    <Text style={s.sectionTitle}>Posts</Text>
                    {userPosts.length === 0 ? (
                        <View style={s.noPosts}>
                            <Ionicons name="images-outline" size={48} color="#D0D4DB" />
                            <Text style={s.noPostsText}>No posts yet</Text>
                        </View>
                    ) : (
                        userPosts.map((post) => {
                            const commentCount = allComments[post.id]?.length ?? 0;
                            const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
                            return (
                                <View key={post.id} style={s.profilePostCard}>
                                    <Text style={s.profilePostText}>{post.text}</Text>
                                    {post.image && <Image source={{ uri: post.image }} style={s.profilePostImage} />}
                                    <View style={s.profilePostStats}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            {Object.keys(post.reactions).slice(0, 3).map(r => (
                                                <ReactionIcon key={r} reaction={r} size={16} />
                                            ))}
                                            <Text style={s.profilePostStatText}> {totalReactions}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => onOpenComments(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <MessageCircle size={15} color="#1877F2" />
                                            <Text style={[s.profilePostStatText, { color: '#1877F2' }]}>
                                                {commentCount} comment{commentCount !== 1 ? 's' : ''}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[s.divider, { marginHorizontal: 0, marginTop: 8 }]} />
                                    <View style={s.actionsRow}>
                                        <TouchableOpacity style={s.actionBtn} onPress={() => onReact(post.id, 'like')}>
                                            <ReactionIcon reaction={post.userReaction ?? 'like'} size={20} color={post.userReaction ? undefined : '#65676B'} />
                                            <Text style={[s.actionLabel, post.userReaction ? { color: REACTION_COLORS[post.userReaction] } : {}]}>
                                                {post.userReaction ? REACTION_LABELS[post.userReaction] : 'Like'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={s.actionBtn} onPress={() => onOpenComments(post.id)}>
                                            <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                                            <Text style={s.actionLabel}>Comment</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={s.actionBtn} onPress={onShare}>
                                            <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
                                            <Text style={s.actionLabel}>Share</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

// ─── Search Modal ────────────────────────────────────────
const SearchModal = ({ visible, onClose, onSelectUser }: {
    visible: boolean; onClose: () => void; onSelectUser: (userId: string) => void;
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            setSearchResults(Object.values(USERS_PROFILES).filter(user =>
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.username.toLowerCase().includes(query.toLowerCase())
            ));
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectUser = (userId: string) => {
        onSelectUser(userId);
        onClose();
        setSearchQuery('');
        setSearchResults([]);
    };

    const renderUserRow = (user: UserProfile) => {
        const isActive = ACTIVE_USER_IDS.includes(user.id);
        return (
            <TouchableOpacity key={user.id} style={s.searchResultItem} onPress={() => handleSelectUser(user.id)}>
                <View style={{ position: 'relative' }}>
                    <View style={[s.searchResultAvatar, { backgroundColor: user.avatarBg }]}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: user.avatarCol }}>{user.initials}</Text>
                    </View>
                    {isActive && (
                        <View style={s.searchActiveDot}>
                            <View style={s.searchActiveDotInner} />
                        </View>
                    )}
                </View>
                <View style={s.searchResultInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={s.searchResultName}>{user.name}</Text>
                        {isActive && <View style={s.inlineActiveDot} />}
                    </View>
                    <Text style={s.searchResultUsername}>{user.username}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#65676B" />
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={s.searchModalContainer}>
                <View style={s.searchHeader}>
                    <TouchableOpacity onPress={onClose} style={s.searchCancelBtn}>
                        <Ionicons name="arrow-back" size={24} color="#050505" />
                    </TouchableOpacity>
                    <View style={s.searchInputContainer}>
                        <Ionicons name="search" size={20} color="#65676B" />
                        <TextInput
                            style={s.searchInput}
                            placeholder="Search users..."
                            placeholderTextColor="#65676B"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            autoFocus
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => handleSearch('')}>
                                <Ionicons name="close-circle" size={20} color="#65676B" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
                    {searchQuery !== '' ? (
                        searchResults.length > 0
                            ? searchResults.map(renderUserRow)
                            : (
                                <View style={s.searchEmpty}>
                                    <Ionicons name="people-outline" size={48} color="#65676B" />
                                    <Text style={s.searchEmptyText}>No users found</Text>
                                </View>
                            )
                    ) : (
                        <>
                            <Text style={{ color: '#65676B', fontSize: 14, marginBottom: 12, fontWeight: '500' }}>Suggestions</Text>
                            {Object.values(USERS_PROFILES).map(renderUserRow)}
                        </>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

// ─── Post Card ───────────────────────────────────────────
const PostCard = ({
    post, onReact, onOpenComments, onShare, onUserPress, commentCount, onImagePress,
}: {
    post: Post; onReact: (postId: string, reaction: string) => void;
    onOpenComments: (postId: string) => void; onShare: () => void;
    onUserPress: (userId: string) => void; commentCount: number;
    onImagePress: (imageUri: string) => void;
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
    const topReactions = Object.keys(post.reactions).slice(0, 3);
    const isActive = ACTIVE_USER_IDS.includes(post.userId);

    return (
        <View style={s.card}>
            <TouchableOpacity style={s.cardHeader} onPress={() => onUserPress(post.userId)}>
                <View style={{ position: 'relative' }}>
                    <View style={[s.avatar, { backgroundColor: post.avatarBg }]}>
                        <Text style={{ fontWeight: '600', fontSize: 15, color: post.avatarCol }}>{post.initials}</Text>
                    </View>
                    {isActive && <View style={s.cardActiveDot} />}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={s.postName}>{post.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={s.postTime}>{post.time} · </Text>
                        <AudienceIcon audience={post.audience} />
                        {isActive && <Text style={{ fontSize: 11, color: '#31A24C', fontWeight: '600' }}>· Active</Text>}
                    </View>
                </View>
                <TouchableOpacity style={s.moreBtn} onPress={(e) => { e.stopPropagation(); setShowOptions(true); }}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#65676B" />
                </TouchableOpacity>
            </TouchableOpacity>

            <Text style={s.postText}>{post.text}</Text>
            {post.image && (
                <TouchableOpacity onPress={() => onImagePress(post.image!)}>
                    <Image source={{ uri: post.image }} style={s.postImage} />
                </TouchableOpacity>
            )}

            <View style={s.statsRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {topReactions.map(r => <ReactionIcon key={r} reaction={r} size={16} />)}
                    <Text style={s.statsText}>{totalReactions}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => onOpenComments(post.id)}>
                        <Text style={s.statsText}>{commentCount} comment{commentCount !== 1 ? 's' : ''}</Text>
                    </TouchableOpacity>
                    <Text style={s.statsText}>{post.shares} shares</Text>
                </View>
            </View>

            <View style={s.divider} />

            <View style={s.actionsRow}>
                <TouchableOpacity style={s.actionBtn} onPress={() => setShowPicker(true)} onLongPress={() => setShowPicker(true)}>
                    <ReactionIcon reaction={post.userReaction ?? 'like'} size={20} color={post.userReaction ? undefined : '#65676B'} />
                    <Text style={[s.actionLabel, post.userReaction ? { color: REACTION_COLORS[post.userReaction] } : {}]}>
                        {post.userReaction ? REACTION_LABELS[post.userReaction] : 'Like'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={() => onOpenComments(post.id)}>
                    <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
                    <Text style={s.actionLabel}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={onShare}>
                    <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
                    <Text style={s.actionLabel}>Share</Text>
                </TouchableOpacity>
            </View>

            <ReactionPicker
                visible={showPicker}
                onSelect={(r) => { onReact(post.id, r); setShowPicker(false); }}
                onClose={() => setShowPicker(false)}
            />
            <PostOptionsMenu
                visible={showOptions}
                onClose={() => setShowOptions(false)}
                onShare={() => onShare()}
                onSave={() => { }}
                onReport={() => { }}
                onHide={() => { }}
            />
        </View>
    );
};

// ─── Home Screen ─────────────────────────────────────────
const HomeScreen = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [comments, setComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
    const [commentSheetVisible, setCommentSheetVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [profileView, setProfileView] = useState<{ visible: boolean; userId: string | null }>({ visible: false, userId: null });
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleReact = (postId: string, reaction: string) => {
        setPosts((prev) => prev.map((p) => {
            if (p.id !== postId) return p;
            const newReactions = { ...p.reactions };
            if (p.userReaction) {
                newReactions[p.userReaction] = Math.max(0, (newReactions[p.userReaction] ?? 1) - 1);
                if (newReactions[p.userReaction] === 0) delete newReactions[p.userReaction];
            }
            if (p.userReaction !== reaction) {
                newReactions[reaction] = (newReactions[reaction] ?? 0) + 1;
                return { ...p, reactions: newReactions, userReaction: reaction };
            }
            return { ...p, reactions: newReactions, userReaction: null };
        }));
    };

    const handleAddComment = (postId: string, text: string) => {
        const newComment: Comment = {
            id: `c_${Date.now()}`,
            name: 'You', initials: 'YO', bg: '#E6F1FB', col: '#185FA5',
            text, time: 'just now',
        };
        setComments((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] ?? []), newComment],
        }));
    };

    const handleOpenComments = (postId: string) => {
        setActiveCommentPost(postId);
        setCommentSheetVisible(true);
    };

    const handleCloseComments = () => {
        setCommentSheetVisible(false);
        setTimeout(() => setActiveCommentPost(null), 350);
    };

    const handleUpdateFriendStatus = (userId: string, isFriend: boolean, requestSent: boolean) => {
        if (USERS_PROFILES[userId]) {
            USERS_PROFILES[userId].isFriend = isFriend;
            USERS_PROFILES[userId].friendRequestSent = requestSent;
        }
    };

    const handleUserPress = (userId: string) => {
        setProfileView({ visible: true, userId });
    };

    const handleImagePress = (imageUri: string) => {
        setSelectedImage(imageUri);
        setImageViewerVisible(true);
    };

    const activePostComments = activeCommentPost ? (comments[activeCommentPost] ?? []) : [];

    if (profileView.visible && profileView.userId) {
        return (
            <>
                <UserProfileScreen
                    userId={profileView.userId}
                    onBack={() => setProfileView({ visible: false, userId: null })}
                    onUpdateFriendStatus={handleUpdateFriendStatus}
                    allPosts={posts}
                    allComments={comments}
                    onReact={handleReact}
                    onOpenComments={handleOpenComments}
                    onShare={() => setShareVisible(true)}
                />
                <CommentSheet
                    postId={activeCommentPost}
                    visible={commentSheetVisible}
                    onClose={handleCloseComments}
                    comments={activePostComments}
                    onAddComment={handleAddComment}
                />
                <ShareSheet visible={shareVisible} onClose={() => setShareVisible(false)} />
                <ImageViewerModal 
                    visible={imageViewerVisible} 
                    imageUri={selectedImage} 
                    onClose={() => setImageViewerVisible(false)} 
                />
            </>
        );
    }

    const ListHeader = () => (
        <View>
            {/* Post composer shortcut */}
            <View style={{ backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[s.avatar, { backgroundColor: '#E6F1FB' }]}>
                    <Text style={{ fontWeight: '600', fontSize: 15, color: '#185FA5' }}>YO</Text>
                </View>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 }}
                    onPress={() => router.push('/screens/CreatePostScreen')}
                >
                    <Text style={{ color: '#65676B', fontSize: 15 }}>What's on your mind?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Text style={s.logo}>SpeakFlow</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={s.headerIcon} onPress={() => setSearchVisible(true)}>
                        <Ionicons name="search" size={20} color="#050505" />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.headerIcon} onPress={() => router.push('/(tabs)/chat')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#050505" />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.headerIcon} onPress={() => router.push('/(tabs)/screens/FriendsScreen')}>
                        <Ionicons name="people-outline" size={20} color="#050505" />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.headerIcon} onPress={() => router.push('/(tabs)/profile')}>
                        <Ionicons name="menu" size={20} color="#050505" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        commentCount={comments[item.id]?.length ?? 0}
                        onReact={handleReact}
                        onOpenComments={handleOpenComments}
                        onShare={() => setShareVisible(true)}
                        onUserPress={handleUserPress}
                        onImagePress={handleImagePress}
                    />
                )}
                ListHeaderComponent={<ListHeader />}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingBottom: 90 }}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={s.fab} onPress={() => router.push('/screens/CreatePostScreen')}>
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>

            <CommentSheet
                postId={activeCommentPost}
                visible={commentSheetVisible}
                onClose={handleCloseComments}
                comments={activePostComments}       
                onAddComment={handleAddComment}
            />

            <ShareSheet visible={shareVisible} onClose={() => setShareVisible(false)} />

            <SearchModal
                visible={searchVisible}
                onClose={() => setSearchVisible(false)}
                onSelectUser={handleUserPress}
            />

            <ImageViewerModal 
                visible={imageViewerVisible} 
                imageUri={selectedImage} 
                onClose={() => setImageViewerVisible(false)} 
            />
        </View>
    );
};

// ─── Styles ──────────────────────────────────────────────
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 52, paddingHorizontal: 16, paddingBottom: 10,
        backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
    },
    logo: { fontSize: 26, fontWeight: '700', color: '#1877F2' },
    headerIcon: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: '#E4E6EB', alignItems: 'center', justifyContent: 'center',
    },

    storyItem: { alignItems: 'center', gap: 4, width: 72 },
    storyRing: { width: 64, height: 64, borderRadius: 32, padding: 2, backgroundColor: '#f09433' },
    storyRingGray: { backgroundColor: '#E4E6EB' },
    storyRingActive: { backgroundColor: '#31A24C' },
    storyInner: {
        width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, borderColor: '#fff',
        backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    addDot: {
        width: 22, height: 22, borderRadius: 11, backgroundColor: '#1877F2',
        alignItems: 'center', justifyContent: 'center',
        position: 'absolute', bottom: 26, right: 2, borderWidth: 2, borderColor: '#fff',
    },
    activeDot: {
        width: 16, height: 16, borderRadius: 8, backgroundColor: '#31A24C',
        position: 'absolute', bottom: 22, right: 0, borderWidth: 2.5, borderColor: '#fff',
    },
    activeLabel: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    activeLabelDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#31A24C' },
    activeLabelText: { fontSize: 10, color: '#31A24C', fontWeight: '600' },
    storyLabel: { fontSize: 11, color: '#65676B', width: 72, textAlign: 'center' },

    card: { backgroundColor: '#fff', borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#E4E6EB' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    cardActiveDot: {
        width: 13, height: 13, borderRadius: 7, backgroundColor: '#31A24C',
        position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#fff',
    },
    postName: { fontSize: 15, fontWeight: '600', color: '#050505' },
    postTime: { fontSize: 12, color: '#65676B', marginTop: 1 },
    moreBtn: { padding: 6 },
    postText: { paddingHorizontal: 16, paddingBottom: 12, fontSize: 15, color: '#050505', lineHeight: 22 },
    postImage: { width: '100%', height: 280, resizeMode: 'cover' },
    statsRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10,
    },
    statsText: { fontSize: 14, color: '#65676B' },
    divider: { height: 0.5, backgroundColor: '#E4E6EB', marginHorizontal: 16 },
    actionsRow: { flexDirection: 'row', paddingVertical: 2 },
    actionBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 10,
    },
    actionLabel: { fontSize: 14, color: '#65676B', fontWeight: '500' },
    reactPicker: {
        position: 'absolute', bottom: 52, left: 0, zIndex: 99,
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 30,
        paddingHorizontal: 10, paddingVertical: 6, gap: 6,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
        borderWidth: 0.5, borderColor: '#E4E6EB',
    },
    reactOpt: { padding: 4 },
    fab: {
        position: 'absolute', bottom: 24, right: 20,
        width: 54, height: 54, borderRadius: 27, backgroundColor: '#1877F2',
        alignItems: 'center', justifyContent: 'center', elevation: 6,
        shadowColor: '#1877F2', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6,
    },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        maxHeight: SCREEN_HEIGHT * 0.82, minHeight: SCREEN_HEIGHT * 0.4,
    },
    shareSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
        padding: 16, paddingBottom: 32,
    },
    optionsSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 8,
    },
    optionItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 20 },
    optionIconWrap: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5',
        alignItems: 'center', justifyContent: 'center',
    },
    optionLabel: { fontSize: 16, color: '#050505', fontWeight: '500' },
    sheetHandle: {
        width: 40, height: 4, borderRadius: 2, backgroundColor: '#E4E6EB',
        alignSelf: 'center', marginTop: 12,
    },
    sheetHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
    },
    sheetTitle: { fontSize: 16, fontWeight: '600', color: '#050505' },

    commentRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    commentAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    commentBubble: {
        backgroundColor: '#F0F2F5', borderTopRightRadius: 14,
        borderBottomLeftRadius: 14, borderBottomRightRadius: 14, padding: 10, flex: 1,
    },
    commentName: { fontSize: 13, fontWeight: '700', color: '#050505' },
    commentText: { fontSize: 14, color: '#050505', marginTop: 3, lineHeight: 20 },
    commentTime: { fontSize: 11, color: '#9EA3AE' },
    commentAction: { fontSize: 12, color: '#65676B', fontWeight: '600' },
    commentInputRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        padding: 12, borderTopWidth: 0.5, borderTopColor: '#E4E6EB', backgroundColor: '#fff',
    },
    commentInput: {
        flex: 1, backgroundColor: '#F0F2F5', borderRadius: 22,
        paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: '#050505',
    },
    sendBtn: {
        width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
    },

    shareGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
    shareItem: { width: '25%', alignItems: 'center', gap: 6, paddingVertical: 8 },
    shareIcon: {
        width: 54, height: 54, borderRadius: 27, backgroundColor: '#F0F2F5',
        alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#E4E6EB',
    },
    shareLabel: { fontSize: 12, color: '#65676B' },
    copyLink: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 14, backgroundColor: '#F0F2F5', borderRadius: 10, borderWidth: 0.5, borderColor: '#E4E6EB',
    },

    profileHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
        backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
    },
    backBtn: { padding: 8, marginLeft: -8 },
    profileHeaderTitle: { fontSize: 18, fontWeight: '600', color: '#050505' },
    coverPhoto: { width: '100%', height: 200, resizeMode: 'cover' },
    profileAvatarContainer: { alignItems: 'center', marginTop: -50, marginBottom: 12, position: 'relative' },
    profileAvatar: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff',
    },
    profileAvatarText: { fontSize: 40, fontWeight: '600' },
    profileActiveDot: {
        width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff',
        position: 'absolute', bottom: 6, right: '33%',
        alignItems: 'center', justifyContent: 'center',
    },
    profileActiveDotInner: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#31A24C' },
    activeChip: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#E6F9EE', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12,
    },
    activeChipDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#31A24C' },
    activeChipText: { fontSize: 12, color: '#31A24C', fontWeight: '700' },
    profileInfo: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
    profileName: { fontSize: 24, fontWeight: '700', color: '#050505' },
    profileUsername: { fontSize: 14, color: '#65676B', marginBottom: 8 },
    profileBio: { fontSize: 14, color: '#050505', textAlign: 'center', marginBottom: 8, lineHeight: 20 },
    profileLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    locationText: { fontSize: 13, color: '#65676B' },
    profileStats: {
        flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 16,
        borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#E4E6EB', marginBottom: 16,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { fontSize: 18, fontWeight: '700', color: '#050505', marginBottom: 4 },
    statLabel: { fontSize: 13, color: '#65676B' },
    statDivider: { width: 1, height: 30, backgroundColor: '#E4E6EB' },
    profileActions: { flexDirection: 'row', gap: 12, width: '100%', paddingHorizontal: 20 },
    actionButton: {
        flex: 1, paddingVertical: 10, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
    },
    addFriendButton: { backgroundColor: '#1877F2' },
    addFriendText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    messageButton: { backgroundColor: '#1877F2' },
    messageButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    friendButton: { backgroundColor: '#F0F2F5', borderWidth: 0.5, borderColor: '#E4E6EB' },
    friendButtonText: { color: '#65676B', fontWeight: '600', fontSize: 14 },
    requestSentButton: { backgroundColor: '#F0F2F5', borderWidth: 0.5, borderColor: '#E4E6EB' },
    requestSentText: { color: '#65676B', fontWeight: '600', fontSize: 14 },
    profilePostsSection: { paddingHorizontal: 16, paddingBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#050505', marginBottom: 12, marginTop: 8 },
    noPosts: { alignItems: 'center', paddingVertical: 40, gap: 10 },
    noPostsText: { color: '#65676B', fontSize: 14 },
    profilePostCard: {
        backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 12,
        borderWidth: 0.5, borderColor: '#E4E6EB',
    },
    profilePostText: { fontSize: 14, color: '#050505', marginBottom: 10, lineHeight: 20 },
    profilePostImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10, resizeMode: 'cover' },
    profilePostStats: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingTop: 8, borderTopWidth: 0.5, borderTopColor: '#E4E6EB',
    },
    profilePostStatText: { fontSize: 12, color: '#65676B' },

    searchModalContainer: { flex: 1, backgroundColor: '#fff' },
    searchHeader: {
        flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16,
        paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB', gap: 12,
    },
    searchCancelBtn: { padding: 4 },
    searchInputContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 12, gap: 8,
    },
    searchInput: { flex: 1, fontSize: 16, paddingVertical: 10, color: '#050505' },
    searchResultItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12,
        borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
    },
    searchResultAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    searchActiveDot: {
        width: 15, height: 15, borderRadius: 8, backgroundColor: '#fff',
        position: 'absolute', bottom: 0, right: 0,
        alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
    },
    searchActiveDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#31A24C' },
    inlineActiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#31A24C' },
    searchResultInfo: { flex: 1 },
    searchResultName: { fontSize: 16, fontWeight: '600', color: '#050505' },
    searchResultUsername: { fontSize: 13, color: '#65676B', marginTop: 2 },
    searchEmpty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
    searchEmptyText: { fontSize: 16, color: '#65676B' },

    // Image Viewer Styles
    imageViewerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageViewerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    imageViewerImage: {
        borderRadius: 12,
    },
    imageViewerClose: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        padding: 8,
    },
    imageViewerActions: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        gap: 30,
        zIndex: 10,
    },
    imageViewerAction: {
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    imageViewerActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default HomeScreen;