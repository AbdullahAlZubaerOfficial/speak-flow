import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Task = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  color: string;
  date?: Date;
};

const TasksScreen = () => {
  const [activeTasks, setActiveTasks] = useState<Task[]>([
    { id: '1', title: 'Review English vocabulary', subtitle: 'Practice new words from yesterday', time: 'Today • 4:00 PM', color: '#FF3B30', date: new Date() },
    { id: '2', title: 'Team meeting preparation', subtitle: 'Prepare slides for project update', time: 'Today • 6:00 PM', color: '#FF3B30', date: new Date() },
    { id: '3', title: 'Watch English learning video', subtitle: 'Grammar lesson on present perfect', time: 'Tomorrow • 2:00 PM', color: '#FF9500', date: new Date(Date.now() + 86400000) },
    { id: '4', title: 'Submit weekly report', subtitle: 'Complete and send to manager', time: 'Friday • 5:00 PM', color: '#34C759', date: new Date(Date.now() + 86400000 * 4) },
  ]);

  const [completedTasks, setCompletedTasks] = useState<Task[]>([
    { id: '5', title: 'Call with Sarah', subtitle: 'Discuss project timeline', time: 'Today • 3:30 PM', color: '#FF9500', date: new Date() },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDateFilterPicker, setShowDateFilterPicker] = useState(false);

  const [newTask, setNewTask] = useState({ title: '', subtitle: '', time: '', color: '#FF3B30' });
  const [editTaskData, setEditTaskData] = useState({ title: '', subtitle: '', time: '', color: '#FF3B30' });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDateForNewTask, setSelectedDateForNewTask] = useState<Date | null>(null);
  const [selectedDateForEdit, setSelectedDateForEdit] = useState<Date | null>(null);

  // Format Due Time
  const formatDueTime = (date: Date): string => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (date.toDateString() === now.toDateString()) return `Today • ${timeStr}`;
    if (date.toDateString() === tomorrow.toDateString()) return `Tomorrow • ${timeStr}`;
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${timeStr}`;
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    let tasks: Task[] = filterTab === 'all' 
      ? [...activeTasks, ...completedTasks] 
      : filterTab === 'active' 
        ? activeTasks 
        : completedTasks;

    if (filterDate) {
      tasks = tasks.filter(task => task.date?.toDateString() === filterDate.toDateString());
    }
    return tasks;
  }, [filterTab, activeTasks, completedTasks, filterDate]);

  // Toggle Complete / Active
  const toggleComplete = (task: Task) => {
    const isCurrentlyCompleted = completedTasks.some(t => t.id === task.id);

    if (isCurrentlyCompleted) {
      // Move back to Active
      setCompletedTasks(prev => prev.filter(t => t.id !== task.id));
      setActiveTasks(prev => [task, ...prev]);
    } else {
      // Move to Completed
      setActiveTasks(prev => prev.filter(t => t.id !== task.id));
      setCompletedTasks(prev => [task, ...prev]);
    }
  };

  // Open Edit Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTaskData({
      title: task.title,
      subtitle: task.subtitle,
      time: task.time,
      color: task.color,
    });
    setSelectedDateForEdit(task.date || new Date());
    setShowEditModal(true);
  };

  // Save Edited Task
  const saveEditedTask = () => {
    if (!editingTask || !editTaskData.title.trim()) return;

    const updatedTask: Task = {
      ...editingTask,
      title: editTaskData.title.trim(),
      subtitle: editTaskData.subtitle.trim() || 'No description added',
      time: editTaskData.time || 'Today • ASAP',
      color: editTaskData.color,
      date: selectedDateForEdit || editingTask.date,
    };

    // Update in active or completed list
    const isCompleted = completedTasks.some(t => t.id === editingTask.id);

    if (isCompleted) {
      setCompletedTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
    } else {
      setActiveTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
    }

    setShowEditModal(false);
    setEditingTask(null);
  };

  // Add New Task
  const addNewTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskToAdd: Task = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      subtitle: newTask.subtitle.trim() || 'No description added',
      time: newTask.time || 'Today • ASAP',
      color: newTask.color,
      date: selectedDateForNewTask || new Date(),
    };

    setActiveTasks([taskToAdd, ...activeTasks]);
    resetAddForm();
  };

  const resetAddForm = () => {
    setNewTask({ title: '', subtitle: '', time: '', color: '#FF3B30' });
    setSelectedDateForNewTask(null);
    setShowAddModal(false);
  };

  const deleteTask = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setActiveTasks(prev => prev.filter(t => t.id !== taskId));
          setCompletedTasks(prev => prev.filter(t => t.id !== taskId));
        },
      },
    ]);
  };

  const renderTask = ({ item }: { item: Task }) => {
    const isCompleted = completedTasks.some(t => t.id === item.id);

    return (
      <TouchableOpacity 
        style={styles.taskCard} 
        onPress={() => openEditModal(item)}   // Card click = Edit
        activeOpacity={0.9}
      >
        <View style={styles.taskLeft}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={(e) => { e.stopPropagation(); toggleComplete(item); }}  // Checkbox only
          >
            {isCompleted ? (
              <Icon name="checkmark-circle" size={26} color="#34C759" />
            ) : (
              <View style={styles.emptyCircle} />
            )}
          </TouchableOpacity>

          <View style={styles.taskContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, isCompleted && styles.completedTitle]}>
                {item.title}
              </Text>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
            </View>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <View style={styles.timeContainer}>
              <Icon name="time-outline" size={14} color="#8E8E93" />
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={(e) => { e.stopPropagation(); deleteTask(item.id); }}
        >
          <Icon name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filterTab === tab && styles.activeTab]}
            onPress={() => setFilterTab(tab)}
          >
            <Text style={[styles.tabText, filterTab === tab && styles.activeTabText]}>
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.filterDateButton} onPress={() => setShowDateFilterPicker(true)}>
          <Icon name="calendar-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {filterDate && (
        <View style={styles.dateFilterBar}>
          <Text style={styles.dateFilterText}>
            Filtered: {filterDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => setFilterDate(null)}>
            <Text style={styles.clearFilter}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingAddButton} onPress={() => setShowAddModal(true)}>
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            {/* ... same add modal fields as before ... */}
            {/* (I'll keep it short for brevity - you can copy from previous version) */}
            <Text style={styles.label}>Task Title</Text>
            <TextInput style={styles.input} placeholder="What needs to be done?" value={newTask.title} onChangeText={(text) => setNewTask({...newTask, title: text})} />

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Add details" value={newTask.subtitle} onChangeText={(text) => setNewTask({...newTask, subtitle: text})} multiline />

            <Text style={styles.label}>Due Date & Time</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setDatePickerVisible(true)}>
              <Icon name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.dateTimeText}>{newTask.time || "Select date and time"}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetAddForm}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButtonModal} onPress={addNewTask}>
                <Text style={styles.addText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>

            <Text style={styles.label}>Task Title</Text>
            <TextInput 
              style={styles.input} 
              value={editTaskData.title} 
              onChangeText={(text) => setEditTaskData({...editTaskData, title: text})} 
            />

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={editTaskData.subtitle} 
              onChangeText={(text) => setEditTaskData({...editTaskData, subtitle: text})} 
              multiline 
            />

            <Text style={styles.label}>Due Date & Time</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setDatePickerVisible(true)}>
              <Icon name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.dateTimeText}>{editTaskData.time || "Select date and time"}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButtonModal} onPress={saveEditedTask}>
                <Text style={styles.addText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date & Time Pickers */}
      <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={(date) => {
        if (showEditModal) setSelectedDateForEdit(date);
        else setSelectedDateForNewTask(date);
        setDatePickerVisible(false);
        setTimePickerVisible(true);
      }} onCancel={() => setDatePickerVisible(false)} />

      <DateTimePickerModal isVisible={isTimePickerVisible} mode="time" onConfirm={(time) => {
        const targetDate = showEditModal ? selectedDateForEdit : selectedDateForNewTask;
        if (targetDate) {
          const finalDate = new Date(targetDate);
          finalDate.setHours(time.getHours(), time.getMinutes());
          const formatted = formatDueTime(finalDate);
          
          if (showEditModal) {
            setEditTaskData({...editTaskData, time: formatted});
          } else {
            setNewTask({...newTask, time: formatted});
          }
        }
        setTimePickerVisible(false);
      }} onCancel={() => setTimePickerVisible(false)} />

      <DateTimePickerModal isVisible={showDateFilterPicker} mode="date" onConfirm={(date) => { setFilterDate(date); setShowDateFilterPicker(false); }} onCancel={() => setShowDateFilterPicker(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (same styles as your previous code)
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: '700', color: '#1C1C1E' },

  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
  activeTabText: { color: '#007AFF' },

  filterDateButton: { padding: 10 },
  dateFilterBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#E8F0FE' },
  dateFilterText: { color: '#007AFF', fontWeight: '500' },
  clearFilter: { color: '#FF3B30', fontWeight: '600' },

  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#8E8E93', fontSize: 16 },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  taskLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: { marginRight: 14, marginTop: 2 },
  emptyCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#C7C7CC' },
  taskContent: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 17, fontWeight: '600', color: '#1C1C1E', flex: 1 },
  completedTitle: { textDecorationLine: 'line-through', color: '#8E8E93' },
  dot: { width: 9, height: 9, borderRadius: 5, marginLeft: 10 },
  subtitle: { fontSize: 15, color: '#555', lineHeight: 20, marginBottom: 8 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { fontSize: 14, color: '#8E8E93' },
  deleteButton: { padding: 8 },

  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 15, color: '#666', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9' },
  textArea: { height: 80, textAlignVertical: 'top' },
  dateTimeButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, backgroundColor: '#f9f9f9', gap: 10 },
  dateTimeText: { fontSize: 16, color: '#333' },

  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 28 },
  cancelButton: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12 },
  addButtonModal: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 12 },
  cancelText: { fontWeight: '600', color: '#333' },
  addText: { fontWeight: '600', color: '#fff' },
});

export default TasksScreen;