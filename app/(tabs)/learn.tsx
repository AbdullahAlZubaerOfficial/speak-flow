import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Modal, TextInput, Alert, SafeAreaView, StatusBar,
  ScrollView, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const tabs = ['Videos', 'Courses', 'Books', 'Vocab'] as const;
type TabType = typeof tabs[number];

// ─── VIDEO CONTENT ───────────────────────────────────────────────────────────
const videoContent = [
  { id: '1', title: 'Master Present Perfect Tense', channel: 'English Academy', duration: '12:45', views: '125K', icon: '🎓', color: ['#6B4EFF','#A45EFF'] as [string,string], likes: 4800, comments: [
    { id:'c1', user:'Sarah M.', avatar:'👩', text:'This helped me so much!', time:'2h ago' },
    { id:'c2', user:'Ali K.', avatar:'🧔', text:'Great explanation, thank you!', time:'5h ago' },
  ]},
  { id: '2', title: 'Common English Phrases for Daily Life', channel: 'Speak Fluently', duration: '8:30', views: '89K', icon: '💬', color: ['#E1306C','#F77737'] as [string,string], likes: 3200, comments: [
    { id:'c1', user:'Maria L.', avatar:'👩‍🦱', text:'Amazing content!', time:'1h ago' },
  ]},
  { id: '3', title: 'Business English Essentials', channel: 'Pro English', duration: '15:20', views: '210K', icon: '💼', color: ['#00C853','#00E676'] as [string,string], likes: 9100, comments: [
    { id:'c1', user:'John D.', avatar:'🧑', text:'Very professional, loved it!', time:'3h ago' },
  ]},
];

// ─── COURSES CONTENT ─────────────────────────────────────────────────────────
const coursesContent = [
  {
    id: 'c1',
    title: 'Complete English Grammar',
    instructor: 'Prof. David Lee',
    level: 'Beginner',
    totalLessons: 12,
    duration: '4h 30m',
    rating: 4.9,
    students: '32K',
    icon: '📝',
    color: ['#4F46E5', '#818CF8'] as [string,string],
    badge: 'Best Seller',
    badgeColor: '#F59E0B',
    description: 'Master English grammar from the ground up. Perfect for absolute beginners wanting to build a strong foundation.',
    lessons: [
      { id: 'l1', title: 'Introduction to Nouns', duration: '8:20', locked: false, description: 'Learn what nouns are and how to use them effectively in sentences.' },
      { id: 'l2', title: 'Verbs & Tenses', duration: '12:15', locked: false, description: 'Understand the different verb tenses and when to use them.' },
      { id: 'l3', title: 'Adjectives & Adverbs', duration: '10:40', locked: false, description: 'Discover how adjectives and adverbs add detail to your sentences.' },
      { id: 'l4', title: 'Prepositions in Depth', duration: '9:05', locked: true, description: 'Master the use of prepositions to express relationships between words.' },
      { id: 'l5', title: 'Sentence Structure', duration: '14:30', locked: true, description: 'Learn how to construct clear, well-formed English sentences.' },
      { id: 'l6', title: 'Punctuation Rules', duration: '7:55', locked: true, description: 'Understand essential punctuation marks and how to use them correctly.' },
    ],
  },
  {
    id: 'c2',
    title: 'Spoken English Mastery',
    instructor: 'Emma Richardson',
    level: 'Intermediate',
    totalLessons: 10,
    duration: '3h 15m',
    rating: 4.8,
    students: '21K',
    icon: '🗣️',
    color: ['#DB2777', '#F472B6'] as [string,string],
    badge: 'Trending',
    badgeColor: '#EF4444',
    description: 'Develop natural spoken English with real-world dialogues, pronunciation tips, and confidence-building exercises.',
    lessons: [
      { id: 'l1', title: 'Pronunciation Basics', duration: '11:00', locked: false, description: 'Learn the correct pronunciation of common English sounds and words.' },
      { id: 'l2', title: 'Everyday Conversations', duration: '13:45', locked: false, description: 'Practice dialogues you will use in daily life situations.' },
      { id: 'l3', title: 'At Work & Office Talk', duration: '9:20', locked: true, description: 'Handle professional situations and workplace conversations with ease.' },
      { id: 'l4', title: 'Idioms & Expressions', duration: '10:10', locked: true, description: 'Learn the most popular English idioms and how to use them naturally.' },
      { id: 'l5', title: 'Storytelling in English', duration: '15:00', locked: true, description: 'Tell engaging stories and anecdotes in fluent English.' },
    ],
  },
  {
    id: 'c3',
    title: 'Business English Pro',
    instructor: 'Michael Grant',
    level: 'Advanced',
    totalLessons: 14,
    duration: '5h 10m',
    rating: 4.7,
    students: '18K',
    icon: '💼',
    color: ['#047857', '#34D399'] as [string,string],
    badge: 'New',
    badgeColor: '#10B981',
    description: 'Elevate your professional communication — emails, presentations, negotiations, and meetings in English.',
    lessons: [
      { id: 'l1', title: 'Professional Email Writing', duration: '10:30', locked: false, description: 'Write clear, professional emails that make a great impression.' },
      { id: 'l2', title: 'Meeting & Presentation Skills', duration: '16:00', locked: false, description: 'Lead and participate in meetings and deliver confident presentations.' },
      { id: 'l3', title: 'Negotiation Language', duration: '12:20', locked: true, description: 'Use strategic language to negotiate deals and resolve conflicts.' },
      { id: 'l4', title: 'Report Writing', duration: '11:45', locked: true, description: 'Structure and write formal business reports in English.' },
      { id: 'l5', title: 'Networking Phrases', duration: '8:55', locked: true, description: 'Build professional relationships using the right language and tone.' },
      { id: 'l6', title: 'Handling Difficult Situations', duration: '13:10', locked: true, description: 'Navigate tough conversations professionally and diplomatically.' },
    ],
  },
  {
    id: 'c4',
    title: 'IELTS Preparation',
    instructor: 'Dr. Sarah Patel',
    level: 'Advanced',
    totalLessons: 16,
    duration: '6h 00m',
    rating: 4.9,
    students: '45K',
    icon: '🏆',
    color: ['#B45309', '#FCD34D'] as [string,string],
    badge: 'Popular',
    badgeColor: '#8B5CF6',
    description: 'Achieve your target IELTS band score with structured lessons covering all four skills: Reading, Writing, Listening & Speaking.',
    lessons: [
      { id: 'l1', title: 'IELTS Overview & Strategy', duration: '9:00', locked: false, description: 'Understand the test format and develop a winning strategy.' },
      { id: 'l2', title: 'Reading: Skimming & Scanning', duration: '14:20', locked: false, description: 'Master fast reading techniques for the IELTS Reading section.' },
      { id: 'l3', title: 'Listening Skills', duration: '12:40', locked: true, description: 'Train your ear for different accents and question types.' },
      { id: 'l4', title: 'Writing Task 1: Graphs', duration: '15:00', locked: true, description: 'Describe charts and graphs accurately and academically.' },
      { id: 'l5', title: 'Writing Task 2: Essays', duration: '18:30', locked: true, description: 'Structure high-scoring argumentative and discussion essays.' },
      { id: 'l6', title: 'Speaking: Fluency Tips', duration: '11:15', locked: true, description: 'Develop fluency and coherence for the IELTS Speaking interview.' },
    ],
  },
];

// ─── BOOKS ───────────────────────────────────────────────────────────────────
const booksContent = [
  { id:'1', title:'Pride and Prejudice', author:'Jane Austen', pages:432, category:'Classic', icon:'📖', color:'#E1306C',
    content:`Chapter 1\n\nIt is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.\n\n"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"\n\nMr. Bennet replied that he had not.\n\n"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."\n\nMr. Bennet made no answer.\n\n"Do not you want to know who has taken it?" cried his wife impatiently.\n\n"You want to tell me, and I have no objection to hearing it."\n\nThis was invitation enough.`},
  { id:'2', title:'The Great Gatsby', author:'F. Scott Fitzgerald', pages:180, category:'Classic', icon:'🎩', color:'#6B4EFF',
    content:`Chapter 1\n\nIn my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\n\n"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven't had the advantages that you've had."\n\nHe didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.\n\nIn consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.`},
  { id:'3', title:'English Grammar Guide', author:'Robert Smith', pages:256, category:'Educational', icon:'📚', color:'#FF9500',
    content:`Introduction to English Grammar\n\nGrammar is the system of rules that governs the use of a language. Understanding grammar helps you communicate more clearly and effectively.\n\nParts of Speech\n\nEvery word in English belongs to one of eight parts of speech:\n\n1. Noun - a person, place, thing, or idea\n   Example: "The dog barked loudly."\n\n2. Verb - an action or state of being\n   Example: "She runs every morning."\n\n3. Adjective - describes a noun\n   Example: "The beautiful sunset amazed everyone."\n\n4. Adverb - modifies a verb, adjective, or another adverb\n   Example: "He spoke very quickly."\n\n5. Pronoun - replaces a noun\n   Example: "He gave it to her."\n\n6. Preposition - shows relationship\n   Example: "The book is on the table."`},
  { id:'4', title:'Business English', author:'Emma Wilson', pages:198, category:'Business', icon:'💼', color:'#00C853',
    content:`Chapter 1: Professional Communication\n\nEffective business communication is the backbone of every successful organization. Whether you are writing an email, presenting in a meeting, or negotiating a deal, your ability to communicate clearly in English is crucial.\n\nKey Principles:\n\n1. Clarity - Be direct and avoid unnecessary complexity\n   "Please send the report by Friday." ✓\n   "I was wondering if perhaps you might be able to send the report sometime before or on Friday." ✗\n\n2. Conciseness - Respect the reader's time\n   Use bullet points and short paragraphs.\n\n3. Professional Tone - Stay formal but friendly\n   "Dear Mr. Smith, I hope this email finds you well..."`},
];

// ─── VOCAB ────────────────────────────────────────────────────────────────────
const initialWords = [
  { id:'1', word:'Entrepreneur', meaning:'A person who starts a business', example:'"She became a successful entrepreneur."' },
  { id:'2', word:'Collaborate', meaning:'Work together on an activity', example:'"Let\'s collaborate on this project."' },
  { id:'3', word:'Innovative', meaning:'Introducing new ideas', example:'"Their approach was highly innovative."' },
];

// ─── LEVEL COLORS ─────────────────────────────────────────────────────────────
const levelColor: Record<string, string> = {
  Beginner: '#10B981',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
};

// ═════════════════════════════════════════════════════════════════════════════
export default function LearnEnglishApp() {
  const [activeTab, setActiveTab] = useState<TabType>('Videos');

  // Videos
  const [selectedVideo, setSelectedVideo] = useState<typeof videoContent[0] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{id:string;user:string;avatar:string;text:string;time:string}[]>([]);

  // Courses
  const [selectedCourse, setSelectedCourse] = useState<typeof coursesContent[0] | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<typeof coursesContent[0]['lessons'][0] | null>(null);
  const [playingLesson, setPlayingLesson] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Books
  const [selectedBook, setSelectedBook] = useState<typeof booksContent[0] | null>(null);

  // Vocab
  const [savedWords, setSavedWords] = useState(initialWords);
  const [showWordModal, setShowWordModal] = useState(false);
  const [newWord, setNewWord] = useState({ word:'', meaning:'', example:'' });

  const openVideo = (item: typeof videoContent[0]) => {
    setSelectedVideo(item);
    setComments(item.comments);
    setPlaying(false);
    setLiked(false);
  };

  const sendComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [{ id: Date.now().toString(), user:'You', avatar:'😊', text: commentText.trim(), time:'Just now' }, ...prev]);
    setCommentText('');
  };

  const addWord = () => {
    if (!newWord.word.trim() || !newWord.meaning.trim()) { Alert.alert('Error','Word and Meaning required'); return; }
    setSavedWords(prev => [{ id: Date.now().toString(), ...newWord }, ...prev]);
    setNewWord({ word:'', meaning:'', example:'' });
    setShowWordModal(false);
  };

  const openLesson = (lesson: typeof coursesContent[0]['lessons'][0]) => {
    if (lesson.locked) {
      Alert.alert('Locked 🔒', 'Complete previous lessons to unlock this one!');
      return;
    }
    setSelectedLesson(lesson);
    setPlayingLesson(false);
  };

  const markComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    setSelectedLesson(null);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <Text style={s.pageTitle}>Learn English</Text>

      {/* Tab Bar */}
      <View style={s.tabContainer}>
        {([
          { key:'Videos',  icon:'play-circle-outline',  iconActive:'play-circle'  },
          { key:'Courses', icon:'school-outline',        iconActive:'school'       },
          { key:'Books',   icon:'book-outline',          iconActive:'book'         },
          { key:'Vocab',   icon:'text-outline',          iconActive:'text'         },
        ] as const).map(t => {
          const isActive = activeTab === (t.key as TabType);
          return (
            <TouchableOpacity
              key={t.key}
              style={[s.tabBtn, isActive && s.tabBtnActive]}
              onPress={() => setActiveTab(t.key as TabType)}
              activeOpacity={0.75}
            >
              <Icon
                name={isActive ? t.iconActive : t.icon}
                size={20}
                color={isActive ? '#6B4EFF' : '#A0A0A0'}
              />
              <Text style={[s.tabText, isActive && s.tabTextActive]}>{t.key}</Text>
              {isActive && <View style={s.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── VIDEOS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'Videos' && (
        <FlatList
          data={videoContent}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding:16, paddingBottom:30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.videoCard} activeOpacity={0.9} onPress={() => openVideo(item)}>
              <LinearGradient colors={item.color} style={s.videoThumb}>
                <Text style={{ fontSize:60 }}>{item.icon}</Text>
                <View style={s.playBtn}><Icon name="play" size={22} color="#fff" /></View>
                <View style={s.durationBadge}><Text style={s.durationTxt}>{item.duration}</Text></View>
              </LinearGradient>
              <View style={{ padding:14 }}>
                <Text style={s.videoTitle}>{item.title}</Text>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:6 }}>
                  <Text style={s.videoMeta}>{item.channel}</Text>
                  <Text style={s.videoMeta}>👁 {item.views} views</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ── COURSES TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'Courses' && (
        <FlatList
          data={coursesContent}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding:16, paddingBottom:30 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={s.coursesHeader}>
              <Text style={s.coursesHeaderTitle}>🎯 Pick Your Path</Text>
              <Text style={s.coursesHeaderSub}>Structured lessons, real progress</Text>
            </View>
          }
          renderItem={({ item }) => {
            const done = item.lessons.filter(l => completedLessons.has(l.id)).length;
            const progress = done / item.lessons.length;
            return (
              <TouchableOpacity style={s.courseCard} activeOpacity={0.88} onPress={() => setSelectedCourse(item)}>
                {/* Gradient Banner */}
                <LinearGradient colors={item.color} style={s.courseBanner}>
                  <Text style={{ fontSize:44 }}>{item.icon}</Text>
                  <View style={[s.courseBadge, { backgroundColor: item.badgeColor }]}>
                    <Text style={s.courseBadgeTxt}>{item.badge}</Text>
                  </View>
                  <View style={s.courseRating}>
                    <Text style={{ color:'#FCD34D', fontSize:13 }}>★ {item.rating}</Text>
                  </View>
                </LinearGradient>

                {/* Info */}
                <View style={{ padding:16 }}>
                  <View style={{ flexDirection:'row', alignItems:'center', marginBottom:6, gap:8 }}>
                    <View style={[s.levelPill, { backgroundColor: levelColor[item.level] + '20' }]}>
                      <Text style={[s.levelTxt, { color: levelColor[item.level] }]}>{item.level}</Text>
                    </View>
                    <Text style={s.courseMetaTxt}>👨‍🏫 {item.instructor}</Text>
                  </View>

                  <Text style={s.courseTitle}>{item.title}</Text>
                  <Text style={s.courseDesc} numberOfLines={2}>{item.description}</Text>

                  {/* Stats Row */}
                  <View style={s.courseStatsRow}>
                    <View style={s.courseStat}>
                      <Icon name="play-circle-outline" size={15} color="#6B4EFF" />
                      <Text style={s.courseStatTxt}>{item.totalLessons} lessons</Text>
                    </View>
                    <View style={s.courseStat}>
                      <Icon name="time-outline" size={15} color="#6B4EFF" />
                      <Text style={s.courseStatTxt}>{item.duration}</Text>
                    </View>
                    <View style={s.courseStat}>
                      <Icon name="people-outline" size={15} color="#6B4EFF" />
                      <Text style={s.courseStatTxt}>{item.students} students</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  {done > 0 && (
                    <View style={{ marginTop:12 }}>
                      <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:5 }}>
                        <Text style={s.progressLabel}>Progress</Text>
                        <Text style={s.progressLabel}>{done}/{item.lessons.length} done</Text>
                      </View>
                      <View style={s.progressTrack}>
                        <LinearGradient
                          colors={item.color}
                          style={[s.progressFill, { width: `${progress * 100}%` as any }]}
                          start={{ x:0, y:0 }} end={{ x:1, y:0 }}
                        />
                      </View>
                    </View>
                  )}

                  <TouchableOpacity style={s.startCourseBtn} onPress={() => setSelectedCourse(item)}>
                    <LinearGradient colors={item.color} style={s.startCourseBtnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                      <Text style={s.startCourseBtnTxt}>{done > 0 ? 'Continue Learning' : 'Start Course'}</Text>
                      <Icon name="arrow-forward" size={17} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* ── BOOKS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'Books' && (
        <FlatList
          data={booksContent}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding:16, paddingBottom:30 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.bookCard} activeOpacity={0.9} onPress={() => setSelectedBook(item)}>
              <View style={[s.bookCover, { backgroundColor: item.color + '20' }]}>
                <Text style={{ fontSize:36 }}>{item.icon}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={s.bookTitle}>{item.title}</Text>
                <Text style={s.bookAuthor}>{item.author}</Text>
                <Text style={s.bookMeta}>{item.pages} pages • {item.category}</Text>
                <View style={[s.readBtn, { backgroundColor: item.color }]}>
                  <Text style={{ color:'#fff', fontWeight:'700', fontSize:13 }}>Read Now →</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ── VOCAB TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'Vocab' && (
        <ScrollView contentContainerStyle={{ padding:16, paddingBottom:30 }} showsVerticalScrollIndicator={false}>
          <View style={s.vocabHeader}>
            <View>
              <Text style={{ fontSize:18, fontWeight:'700' }}>Saved Words</Text>
              <Text style={{ color:'#888', marginTop:2 }}>{savedWords.length} words saved</Text>
            </View>
            <TouchableOpacity style={s.addCircle} onPress={() => setShowWordModal(true)}>
              <Icon name="add" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
          {savedWords.map(w => (
            <View key={w.id} style={s.wordCard}>
              <View style={{ flex:1 }}>
                <Text style={s.wordTitle}>{w.word}</Text>
                <Text style={s.wordMeaning}>{w.meaning}</Text>
                {!!w.example && <Text style={s.wordExample}>{w.example}</Text>}
              </View>
              <TouchableOpacity onPress={() => setSavedWords(p => p.filter(x => x.id !== w.id))}>
                <Icon name="trash-outline" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          COURSE DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <Modal visible={!!selectedCourse} animationType="slide" onRequestClose={() => setSelectedCourse(null)}>
        {selectedCourse && (
          <SafeAreaView style={{ flex:1, backgroundColor:'#0F0F14' }}>
            <StatusBar barStyle="light-content" backgroundColor="#0F0F14" />

            {/* Hero Banner */}
            <LinearGradient colors={selectedCourse.color} style={s.courseHero}>
              <TouchableOpacity style={s.heroBack} onPress={() => setSelectedCourse(null)}>
                <Icon name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={{ fontSize:56, marginTop:10 }}>{selectedCourse.icon}</Text>
              <View style={[s.courseBadge, { backgroundColor: selectedCourse.badgeColor, alignSelf:'center', marginTop:8 }]}>
                <Text style={s.courseBadgeTxt}>{selectedCourse.badge}</Text>
              </View>
            </LinearGradient>

            {/* Scrollable Course Info + Lessons */}
            <ScrollView style={{ flex:1, backgroundColor:'#fff', borderTopLeftRadius:28, borderTopRightRadius:28, marginTop:-24 }}
              contentContainerStyle={{ padding:24, paddingBottom:40 }} showsVerticalScrollIndicator={false}>

              {/* Title & Meta */}
              <View style={[s.levelPill, { backgroundColor: levelColor[selectedCourse.level] + '15', alignSelf:'flex-start', marginBottom:10 }]}>
                <Text style={[s.levelTxt, { color: levelColor[selectedCourse.level] }]}>{selectedCourse.level}</Text>
              </View>
              <Text style={s.courseDetailTitle}>{selectedCourse.title}</Text>
              <Text style={s.courseDetailDesc}>{selectedCourse.description}</Text>

              {/* Quick Stats */}
              <View style={s.courseDetailStats}>
                {[
                  { icon:'star', val:`${selectedCourse.rating} Rating`, color:'#F59E0B' },
                  { icon:'people', val:`${selectedCourse.students} Students`, color:'#6B4EFF' },
                  { icon:'time', val:selectedCourse.duration, color:'#EC4899' },
                  { icon:'play-circle', val:`${selectedCourse.totalLessons} Lessons`, color:'#10B981' },
                ].map((st, i) => (
                  <View key={i} style={s.courseDetailStat}>
                    <Icon name={`${st.icon}-outline` as any} size={22} color={st.color} />
                    <Text style={s.courseDetailStatTxt}>{st.val}</Text>
                  </View>
                ))}
              </View>

              {/* Instructor */}
              <View style={s.instructorRow}>
                <View style={s.instructorAvatar}>
                  <Text style={{ fontSize:22 }}>👨‍🏫</Text>
                </View>
                <View>
                  <Text style={s.instructorName}>{selectedCourse.instructor}</Text>
                  <Text style={s.instructorRole}>Course Instructor</Text>
                </View>
              </View>

              {/* Progress */}
              {(() => {
                const done = selectedCourse.lessons.filter(l => completedLessons.has(l.id)).length;
                const pct = Math.round((done / selectedCourse.lessons.length) * 100);
                return done > 0 ? (
                  <View style={s.courseDetailProgress}>
                    <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 }}>
                      <Text style={{ fontWeight:'700', color:'#1C1C1E' }}>Your Progress</Text>
                      <Text style={{ fontWeight:'700', color:'#6B4EFF' }}>{pct}%</Text>
                    </View>
                    <View style={s.progressTrack}>
                      <LinearGradient
                        colors={selectedCourse.color}
                        style={[s.progressFill, { width: `${pct}%` as any }]}
                        start={{ x:0, y:0 }} end={{ x:1, y:0 }}
                      />
                    </View>
                    <Text style={{ color:'#888', marginTop:6, fontSize:13 }}>{done} of {selectedCourse.lessons.length} lessons completed</Text>
                  </View>
                ) : null;
              })()}

              {/* Lessons List */}
              <Text style={s.lessonsHeading}>📚 Course Lessons</Text>

              {selectedCourse.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.has(lesson.id);
                const isLocked = lesson.locked;
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[s.lessonRow, isCompleted && s.lessonRowDone]}
                    activeOpacity={isLocked ? 1 : 0.82}
                    onPress={() => openLesson(lesson)}
                  >
                    {/* Number bubble */}
                    <View style={[s.lessonNumBubble,
                      isCompleted ? { backgroundColor:'#10B981' } :
                      isLocked    ? { backgroundColor:'#E5E7EB' } :
                                    { backgroundColor: selectedCourse.color[0] + '20' }
                    ]}>
                      {isCompleted
                        ? <Icon name="checkmark" size={16} color="#fff" />
                        : isLocked
                          ? <Icon name="lock-closed" size={14} color="#9CA3AF" />
                          : <Text style={[s.lessonNum, { color: selectedCourse.color[0] }]}>{idx + 1}</Text>
                      }
                    </View>

                    {/* Text */}
                    <View style={{ flex:1 }}>
                      <Text style={[s.lessonTitle, isLocked && { color:'#9CA3AF' }]}>{lesson.title}</Text>
                      <Text style={s.lessonDurTxt} numberOfLines={1}>{lesson.description}</Text>
                    </View>

                    {/* Right */}
                    <View style={s.lessonRight}>
                      <Text style={[s.lessonDuration, isLocked && { color:'#C4C4C4' }]}>{lesson.duration}</Text>
                      {!isLocked && !isCompleted &&
                        <View style={[s.lessonPlayBtn, { backgroundColor: selectedCourse.color[0] }]}>
                          <Icon name="play" size={11} color="#fff" />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════════
          LESSON PLAYER MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <Modal visible={!!selectedLesson} animationType="slide" onRequestClose={() => setSelectedLesson(null)}>
        {selectedLesson && selectedCourse && (
          <SafeAreaView style={{ flex:1, backgroundColor:'#0D0D0D' }}>
            <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

            {/* Video Player Area */}
            <LinearGradient colors={selectedCourse.color} style={s.lessonPlayer}>
              <Text style={{ fontSize:64 }}>{selectedCourse.icon}</Text>
              <TouchableOpacity style={s.bigPlayBtn} onPress={() => setPlayingLesson(p => !p)}>
                <Icon name={playingLesson ? 'pause' : 'play'} size={34} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedLesson(null)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
              {/* Duration badge */}
              <View style={s.durationBadge}>
                <Icon name="time-outline" size={12} color="#fff" />
                <Text style={[s.durationTxt, { marginLeft:4 }]}>{selectedLesson.duration}</Text>
              </View>
              {!playingLesson && (
                <View style={s.pausedOverlay}>
                  <Text style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>Tap ▶ to play lesson</Text>
                </View>
              )}
            </LinearGradient>

            {/* Lesson Info */}
            <View style={{ flex:1, backgroundColor:'#fff', borderTopLeftRadius:28, borderTopRightRadius:28, marginTop:-20 }}>
              <ScrollView contentContainerStyle={{ padding:24, paddingBottom:40 }} showsVerticalScrollIndicator={false}>
                {/* Course breadcrumb */}
                <Text style={s.lessonBreadcrumb}>{selectedCourse.title}</Text>

                <Text style={s.lessonDetailTitle}>{selectedLesson.title}</Text>
                <Text style={s.lessonDetailDesc}>{selectedLesson.description}</Text>

                {/* Lesson meta chips */}
                <View style={{ flexDirection:'row', gap:10, marginTop:16, flexWrap:'wrap' }}>
                  {[
                    { icon:'time-outline', label:selectedLesson.duration },
                    { icon:'school-outline', label: selectedCourse.level },
                    { icon:'person-outline', label: selectedCourse.instructor },
                  ].map((chip, i) => (
                    <View key={i} style={s.lessonChip}>
                      <Icon name={chip.icon as any} size={14} color='#6B4EFF' />
                      <Text style={s.lessonChipTxt}>{chip.label}</Text>
                    </View>
                  ))}
                </View>

                {/* About this lesson */}
                <View style={s.lessonAboutBox}>
                  <Text style={s.lessonAboutTitle}>📌 About This Lesson</Text>
                  <Text style={s.lessonAboutTxt}>
                    In this video tutorial, you will explore "{selectedLesson.title}" in depth. Follow along with the instructor's clear, step-by-step explanation. Pause and replay any section to reinforce your understanding. Take notes on key concepts and practice the examples provided.
                  </Text>
                </View>

                {/* What you'll learn */}
                <View style={s.lessonLearnBox}>
                  <Text style={s.lessonAboutTitle}>✅ What You'll Learn</Text>
                  {[
                    'Core concepts explained clearly',
                    'Real-world examples and usage',
                    'Practice exercises to test yourself',
                    'Tips to remember key rules',
                  ].map((pt, i) => (
                    <View key={i} style={{ flexDirection:'row', alignItems:'center', marginTop:8, gap:8 }}>
                      <View style={s.learnDot} />
                      <Text style={s.learnPoint}>{pt}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Mark Complete Button */}
              {!completedLessons.has(selectedLesson.id) ? (
                <TouchableOpacity style={s.completeBtnWrap} onPress={() => markComplete(selectedLesson.id)}>
                  <LinearGradient colors={selectedCourse.color} style={s.completeBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
                    <Icon name="checkmark-circle-outline" size={22} color="#fff" />
                    <Text style={s.completeBtnTxt}>Mark as Complete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={s.completeBtnWrap}>
                  <View style={[s.completeBtn, { backgroundColor:'#10B981', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8 }]}>
                    <Icon name="checkmark-circle" size={22} color="#fff" />
                    <Text style={s.completeBtnTxt}>Lesson Completed 🎉</Text>
                  </View>
                </View>
              )}
            </View>
          </SafeAreaView>
        )}
      </Modal>

      {/* ── VIDEO MODAL ────────────────────────────────────────────────────── */}
      <Modal visible={!!selectedVideo} animationType="slide" onRequestClose={() => setSelectedVideo(null)}>
        <SafeAreaView style={{ flex:1, backgroundColor:'#0D0D0D' }}>
          <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
          {selectedVideo && (
            <>
              <LinearGradient colors={selectedVideo.color} style={s.player}>
                <Text style={{ fontSize:70 }}>{selectedVideo.icon}</Text>
                <TouchableOpacity style={s.bigPlayBtn} onPress={() => setPlaying(p => !p)}>
                  <Icon name={playing ? 'pause' : 'play'} size={36} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedVideo(null)}>
                  <Icon name="close" size={26} color="#fff" />
                </TouchableOpacity>
                {!playing && <View style={s.pausedOverlay}><Text style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>Tap ▶ to play</Text></View>}
              </LinearGradient>
              <View style={{ flex:1, backgroundColor:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, marginTop:-16 }}>
                <View style={{ padding:20, borderBottomWidth:1, borderBottomColor:'#F0F0F0' }}>
                  <Text style={{ fontSize:18, fontWeight:'700', color:'#1C1C1E', marginBottom:4 }}>{selectedVideo.title}</Text>
                  <Text style={{ color:'#888' }}>{selectedVideo.channel} • 👁 {selectedVideo.views} views</Text>
                  <View style={{ flexDirection:'row', marginTop:14, gap:16 }}>
                    <TouchableOpacity style={[s.actionBtn, liked && { backgroundColor:'#6B4EFF20' }]} onPress={() => setLiked(p => !p)}>
                      <Icon name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#6B4EFF' : '#555'} />
                      <Text style={[s.actionTxt, liked && { color:'#6B4EFF' }]}>{selectedVideo.likes + (liked ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn}>
                      <Icon name="share-social-outline" size={20} color="#555" />
                      <Text style={s.actionTxt}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn}>
                      <Icon name="bookmark-outline" size={20} color="#555" />
                      <Text style={s.actionTxt}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ fontSize:16, fontWeight:'700', padding:20, paddingBottom:10 }}>Comments ({comments.length})</Text>
                <FlatList
                  data={comments}
                  keyExtractor={c => c.id}
                  contentContainerStyle={{ paddingHorizontal:20, paddingBottom:16 }}
                  renderItem={({ item:c }) => (
                    <View style={s.commentRow}>
                      <Text style={s.commentAvatar}>{c.avatar}</Text>
                      <View style={s.commentBubble}>
                        <Text style={s.commentUser}>{c.user} <Text style={s.commentTime}>{c.time}</Text></Text>
                        <Text style={s.commentText}>{c.text}</Text>
                      </View>
                    </View>
                  )}
                />
                <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}>
                  <View style={s.commentInput}>
                    <TextInput style={s.commentField} placeholder="Add a comment..." value={commentText} onChangeText={setCommentText} returnKeyType="send" onSubmitEditing={sendComment} />
                    <TouchableOpacity style={s.sendBtn} onPress={sendComment}>
                      <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>

      {/* ── BOOK READER MODAL ──────────────────────────────────────────────── */}
      <Modal visible={!!selectedBook} animationType="slide" onRequestClose={() => setSelectedBook(null)}>
        {selectedBook && (
          <SafeAreaView style={{ flex:1, backgroundColor:'#FFF8F0' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />
            <View style={[s.bookReaderHeader, { borderBottomColor: selectedBook.color + '40' }]}>
              <TouchableOpacity onPress={() => setSelectedBook(null)} style={{ padding:6 }}>
                <Icon name="arrow-back" size={26} color="#1C1C1E" />
              </TouchableOpacity>
              <View style={{ flex:1, alignItems:'center' }}>
                <Text style={s.readerTitle} numberOfLines={1}>{selectedBook.title}</Text>
                <Text style={{ fontSize:12, color:'#888' }}>{selectedBook.author}</Text>
              </View>
              <View style={{ width:38 }} />
            </View>
            <View style={[s.bookStrip, { backgroundColor: selectedBook.color }]}>
              <Text style={{ fontSize:28 }}>{selectedBook.icon}</Text>
              <Text style={{ color:'#fff', fontWeight:'700', marginLeft:12, fontSize:15 }}>{selectedBook.category}</Text>
              <Text style={{ color:'rgba(255,255,255,0.8)', marginLeft:'auto', fontSize:13 }}>{selectedBook.pages} pages</Text>
            </View>
            <ScrollView contentContainerStyle={s.bookContent} showsVerticalScrollIndicator={false}>
              {selectedBook.content.split('\n\n').map((para, i) => {
                const isHeading = para.length < 40 && !para.startsWith('"') && !para.match(/^\d+\./);
                return <Text key={i} style={isHeading ? s.bookHeading : s.bookParagraph}>{para}</Text>;
              })}
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* ── ADD WORD MODAL ─────────────────────────────────────────────────── */}
      <Modal visible={showWordModal} transparent animationType="slide" onRequestClose={() => setShowWordModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{ flex:1 }}>
          <View style={s.modalOverlay}>
            <View style={s.modalBox}>
              <View style={s.modalHead}>
                <Text style={s.modalTitle}>Add New Word</Text>
                <TouchableOpacity onPress={() => setShowWordModal(false)}><Icon name="close" size={26} color="#999" /></TouchableOpacity>
              </View>
              <TextInput style={s.input} placeholder="Word" value={newWord.word} onChangeText={t => setNewWord(p => ({...p, word:t}))} />
              <TextInput style={s.input} placeholder="Meaning" value={newWord.meaning} onChangeText={t => setNewWord(p => ({...p, meaning:t}))} />
              <TextInput style={[s.input, { height:80, textAlignVertical:'top' }]} placeholder="Example (optional)" value={newWord.example} onChangeText={t => setNewWord(p => ({...p, example:t}))} multiline />
              <TouchableOpacity style={s.addWordBtn} onPress={addWord}>
                <Text style={{ color:'#fff', fontWeight:'700', fontSize:16 }}>Add Word</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#F8F9FA' },
  pageTitle:    { fontSize:28, fontWeight:'800', color:'#1C1C1E', paddingHorizontal:20, paddingTop:44, paddingBottom:4 },

  // ── Tab Bar ──
  tabContainer: { flexDirection:'row', backgroundColor:'#fff', marginHorizontal:16, marginTop:10, marginBottom:6, borderRadius:18, padding:5, elevation:5, shadowColor:'#6B4EFF', shadowOffset:{width:0,height:4}, shadowOpacity:0.12, shadowRadius:12 },
  tabBtn:       { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:10, borderRadius:14, gap:4, position:'relative' },
  tabBtnActive: { backgroundColor:'#F0ECFF' },
  tabText:      { fontSize:11, fontWeight:'600', color:'#A0A0A0', letterSpacing:0.2 },
  tabTextActive:{ color:'#6B4EFF', fontWeight:'800' },
  tabIndicator: { position:'absolute', bottom:4, width:20, height:3, borderRadius:2, backgroundColor:'#6B4EFF' },

  // ── Videos ──
  videoCard:    { marginBottom:20, borderRadius:18, overflow:'hidden', backgroundColor:'#fff', elevation:6, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.12, shadowRadius:12 },
  videoThumb:   { height:190, justifyContent:'center', alignItems:'center', position:'relative' },
  playBtn:      { position:'absolute', bottom:14, left:14, backgroundColor:'rgba(0,0,0,0.55)', width:44, height:44, borderRadius:22, justifyContent:'center', alignItems:'center' },
  durationBadge:{ position:'absolute', bottom:14, right:14, backgroundColor:'rgba(0,0,0,0.7)', paddingHorizontal:10, paddingVertical:4, borderRadius:8, flexDirection:'row', alignItems:'center' },
  durationTxt:  { color:'#fff', fontSize:13, fontWeight:'700' },
  videoTitle:   { fontSize:17, fontWeight:'700', color:'#1C1C1E' },
  videoMeta:    { fontSize:13, color:'#888' },

  // ── Courses List ──
  coursesHeader:{ backgroundColor:'#EEF2FF', borderRadius:18, padding:20, marginBottom:18 },
  coursesHeaderTitle: { fontSize:20, fontWeight:'800', color:'#1C1C1E' },
  coursesHeaderSub:   { color:'#6B7280', marginTop:3, fontSize:14 },

  courseCard:   { marginBottom:22, borderRadius:22, overflow:'hidden', backgroundColor:'#fff', elevation:8, shadowColor:'#6B4EFF', shadowOffset:{width:0,height:6}, shadowOpacity:0.13, shadowRadius:16 },
  courseBanner: { height:140, justifyContent:'center', alignItems:'center', position:'relative' },
  courseBadge:  { position:'absolute', top:14, right:14, paddingHorizontal:12, paddingVertical:5, borderRadius:20 },
  courseBadgeTxt: { color:'#fff', fontSize:11, fontWeight:'800', letterSpacing:0.4 },
  courseRating: { position:'absolute', bottom:12, left:14, backgroundColor:'rgba(0,0,0,0.35)', paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
  levelPill:    { paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
  levelTxt:     { fontSize:11, fontWeight:'800', letterSpacing:0.4 },
  courseMetaTxt:{ fontSize:13, color:'#666' },
  courseTitle:  { fontSize:18, fontWeight:'800', color:'#1C1C1E', marginTop:4, marginBottom:6 },
  courseDesc:   { fontSize:13, color:'#6B7280', lineHeight:20 },
  courseStatsRow:{ flexDirection:'row', gap:14, marginTop:12, flexWrap:'wrap' },
  courseStat:   { flexDirection:'row', alignItems:'center', gap:5 },
  courseStatTxt:{ fontSize:12, color:'#444', fontWeight:'600' },
  progressLabel:{ fontSize:12, color:'#888' },
  progressTrack:{ height:7, backgroundColor:'#F0F0F0', borderRadius:10, overflow:'hidden' },
  progressFill: { height:7, borderRadius:10 },
  startCourseBtn:{ marginTop:14 },
  startCourseBtnGrad:{ flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:13, borderRadius:14 },
  startCourseBtnTxt:{ color:'#fff', fontWeight:'800', fontSize:15 },

  // ── Course Detail Modal ──
  courseHero:   { height:220, justifyContent:'center', alignItems:'center', position:'relative' },
  heroBack:     { position:'absolute', top:16, left:16, backgroundColor:'rgba(0,0,0,0.3)', borderRadius:20, padding:8 },
  courseDetailTitle:  { fontSize:24, fontWeight:'800', color:'#1C1C1E', marginBottom:8 },
  courseDetailDesc:   { fontSize:15, color:'#555', lineHeight:24 },
  courseDetailStats:  { flexDirection:'row', flexWrap:'wrap', gap:12, marginVertical:20, backgroundColor:'#F9F9FF', borderRadius:16, padding:16 },
  courseDetailStat:   { alignItems:'center', gap:4, flex:1, minWidth:80 },
  courseDetailStatTxt:{ fontSize:12, color:'#444', fontWeight:'600', textAlign:'center' },
  instructorRow:{ flexDirection:'row', alignItems:'center', gap:12, marginBottom:20, backgroundColor:'#F3F4F6', borderRadius:16, padding:14 },
  instructorAvatar:{ width:46, height:46, borderRadius:23, backgroundColor:'#E0E7FF', justifyContent:'center', alignItems:'center' },
  instructorName:{ fontWeight:'700', fontSize:15, color:'#1C1C1E' },
  instructorRole:{ color:'#888', fontSize:12, marginTop:2 },
  courseDetailProgress:{ backgroundColor:'#F9F9FF', borderRadius:16, padding:16, marginBottom:20 },
  lessonsHeading:{ fontSize:18, fontWeight:'800', color:'#1C1C1E', marginBottom:14 },

  lessonRow:    { flexDirection:'row', alignItems:'center', backgroundColor:'#FAFAFA', borderRadius:16, padding:14, marginBottom:10, gap:12, borderWidth:1.5, borderColor:'#F0F0F0' },
  lessonRowDone:{ backgroundColor:'#F0FDF4', borderColor:'#BBF7D0' },
  lessonNumBubble:{ width:38, height:38, borderRadius:19, justifyContent:'center', alignItems:'center' },
  lessonNum:    { fontSize:15, fontWeight:'800' },
  lessonTitle:  { fontSize:15, fontWeight:'700', color:'#1C1C1E', marginBottom:3 },
  lessonDurTxt: { fontSize:12, color:'#9CA3AF' },
  lessonRight:  { alignItems:'flex-end', gap:6 },
  lessonDuration:{ fontSize:12, fontWeight:'600', color:'#6B7280' },
  lessonPlayBtn:{ width:26, height:26, borderRadius:13, justifyContent:'center', alignItems:'center' },

  // ── Lesson Player Modal ──
  lessonPlayer: { height:250, justifyContent:'center', alignItems:'center', position:'relative' },
  lessonBreadcrumb:{ fontSize:13, color:'#6B4EFF', fontWeight:'700', marginBottom:6 },
  lessonDetailTitle:{ fontSize:22, fontWeight:'800', color:'#1C1C1E', marginBottom:8 },
  lessonDetailDesc: { fontSize:15, color:'#555', lineHeight:24 },
  lessonChip:   { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'#EEF2FF', paddingHorizontal:12, paddingVertical:6, borderRadius:20 },
  lessonChipTxt:{ fontSize:13, color:'#6B4EFF', fontWeight:'600' },
  lessonAboutBox:{ marginTop:22, backgroundColor:'#FAFAFA', borderRadius:16, padding:16 },
  lessonAboutTitle:{ fontSize:15, fontWeight:'800', color:'#1C1C1E', marginBottom:8 },
  lessonAboutTxt:{ fontSize:14, color:'#555', lineHeight:22 },
  lessonLearnBox:{ marginTop:14, backgroundColor:'#F0FDF4', borderRadius:16, padding:16 },
  learnDot:     { width:8, height:8, borderRadius:4, backgroundColor:'#10B981' },
  learnPoint:   { fontSize:14, color:'#374151', flex:1 },
  completeBtnWrap:{ padding:20, paddingTop:10 },
  completeBtn:  { borderRadius:16, paddingVertical:16, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10 },
  completeBtnTxt:{ color:'#fff', fontWeight:'800', fontSize:16 },

  // ── Video Modal ──
  player:       { height:260, justifyContent:'center', alignItems:'center', position:'relative' },
  bigPlayBtn:   { backgroundColor:'rgba(0,0,0,0.45)', width:70, height:70, borderRadius:35, justifyContent:'center', alignItems:'center', position:'absolute' },
  closeBtn:     { position:'absolute', top:16, left:16, backgroundColor:'rgba(0,0,0,0.4)', borderRadius:20, padding:6 },
  pausedOverlay:{ position:'absolute', bottom:20 },
  actionBtn:    { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#F5F5F5', paddingHorizontal:16, paddingVertical:10, borderRadius:20 },
  actionTxt:    { fontSize:14, fontWeight:'600', color:'#555' },
  commentRow:   { flexDirection:'row', marginBottom:14, gap:10 },
  commentAvatar:{ fontSize:28, marginTop:2 },
  commentBubble:{ flex:1, backgroundColor:'#F5F5F5', borderRadius:14, padding:12 },
  commentUser:  { fontWeight:'700', fontSize:13, color:'#1C1C1E', marginBottom:4 },
  commentTime:  { fontWeight:'400', color:'#aaa', fontSize:12 },
  commentText:  { color:'#333', fontSize:14, lineHeight:20 },
  commentInput: { flexDirection:'row', padding:14, borderTopWidth:1, borderTopColor:'#F0F0F0', gap:10, alignItems:'center' },
  commentField: { flex:1, backgroundColor:'#F5F5F5', borderRadius:24, paddingHorizontal:18, paddingVertical:10, fontSize:15 },
  sendBtn:      { backgroundColor:'#6B4EFF', width:46, height:46, borderRadius:23, justifyContent:'center', alignItems:'center' },

  // ── Books ──
  bookCard:     { flexDirection:'row', backgroundColor:'#fff', borderRadius:18, padding:16, marginBottom:14, elevation:5, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.1, shadowRadius:10, gap:14 },
  bookCover:    { width:72, height:90, borderRadius:12, justifyContent:'center', alignItems:'center' },
  bookTitle:    { fontSize:16, fontWeight:'700', color:'#1C1C1E', marginBottom:2 },
  bookAuthor:   { fontSize:13, color:'#888', marginBottom:4 },
  bookMeta:     { fontSize:12, color:'#aaa', marginBottom:10 },
  readBtn:      { alignSelf:'flex-start', paddingHorizontal:14, paddingVertical:6, borderRadius:20 },
  bookReaderHeader:{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1 },
  readerTitle:  { fontSize:16, fontWeight:'700', color:'#1C1C1E' },
  bookStrip:    { flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingVertical:12 },
  bookContent:  { padding:24, paddingBottom:60 },
  bookHeading:  { fontSize:20, fontWeight:'800', color:'#1C1C1E', marginTop:24, marginBottom:12 },
  bookParagraph:{ fontSize:16, lineHeight:28, color:'#333', marginBottom:16, letterSpacing:0.2 },

  // ── Vocab ──
  vocabHeader:  { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#F0E6FF', padding:18, borderRadius:16, marginBottom:18 },
  addCircle:    { backgroundColor:'#6B4EFF', width:46, height:46, borderRadius:23, justifyContent:'center', alignItems:'center' },
  wordCard:     { backgroundColor:'#fff', borderRadius:16, padding:18, marginBottom:12, flexDirection:'row', alignItems:'flex-start', elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.07, shadowRadius:8 },
  wordTitle:    { fontSize:18, fontWeight:'700', color:'#1C1C1E' },
  wordMeaning:  { color:'#555', fontSize:15, marginVertical:4 },
  wordExample:  { fontStyle:'italic', color:'#888', fontSize:14 },

  // ── Word Modal ──
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'flex-end' },
  modalBox:     { backgroundColor:'#fff', borderTopLeftRadius:28, borderTopRightRadius:28, padding:24, paddingBottom:32 },
  modalHead:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:22 },
  modalTitle:   { fontSize:22, fontWeight:'700' },
  input:        { borderWidth:1.5, borderColor:'#E8E8E8', borderRadius:14, padding:14, fontSize:16, marginBottom:14 },
  addWordBtn:   { backgroundColor:'#6B4EFF', padding:16, borderRadius:14, alignItems:'center', marginTop:6 },
});