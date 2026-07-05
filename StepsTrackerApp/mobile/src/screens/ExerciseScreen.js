import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button, TextInput, List, Portal, Modal, Chip, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const EXERCISE_TYPES = [
  { name: 'Running', icon: 'bicycle', color: '#ff6b6b' },
  { name: 'Walking', icon: 'walk', color: '#4ecdc4' },
  { name: 'Cycling', icon: 'bicycle', color: '#45b7d1' },
  { name: 'Gym', icon: 'barbell', color: '#f9ca24' },
  { name: 'Yoga', icon: 'body', color: '#6c5ce7' },
  { name: 'Swimming', icon: 'water', color: '#00b894' },
  { name: 'Other', icon: 'fitness', color: '#636e72' },
];

export default function ExerciseScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState([]);
  
  const [selectedType, setSelectedType] = useState('Running');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('moderate');
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAddExercise = () => {
    if (!duration || isNaN(duration)) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    const newExercise = {
      id: Date.now(),
      type: selectedType,
      duration: parseInt(duration),
      intensity,
      notes,
      startTime,
      calories: calculateCalories(parseInt(duration), intensity),
    };

    setExercises([newExercise, ...exercises]);
    
    setModalVisible(false);
    setDuration('');
    setNotes('');
    setIntensity('moderate');
    
    Alert.alert('Success', 'Exercise logged successfully!');
  };

  const calculateCalories = (minutes, intensity) => {
    const baseCalories = minutes * 7;
    const multiplier = intensity === 'low' ? 0.7 : intensity === 'high' ? 1.3 : 1.0;
    return Math.round(baseCalories * multiplier);
  };

  const getTodayExercises = () => {
    const today = new Date().toDateString();
    return exercises.filter(ex => new Date(ex.startTime).toDateString() === today);
  };

  const todayExercises = getTodayExercises();
  const totalDuration = todayExercises.reduce((sum, ex) => sum + ex.duration, 0);
  const totalCalories = todayExercises.reduce((sum, ex) => sum + ex.calories, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Exercise Log</Title>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryTitle}>Today's Summary</Title>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Ionicons name="time" size={24} color="#6200ee" />
                <Text style={styles.summaryValue}>{totalDuration} min</Text>
                <Text style={styles.summaryLabel}>Duration</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="flame" size={24} color="#ff9f43" />
                <Text style={styles.summaryValue}>{totalCalories}</Text>
                <Text style={styles.summaryLabel}>Calories</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="fitness" size={24} color="#4ecdc4" />
                <Text style={styles.summaryValue}>{todayExercises.length}</Text>
                <Text style={styles.summaryLabel}>Workouts</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          icon="plus"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          Log Exercise
        </Button>

        <Title style={styles.historyTitle}>Recent Exercises</Title>
        
        {exercises.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No exercises logged yet</Text>
              <Text style={styles.emptySubtext}>Tap the button above to add your first workout!</Text>
            </Card.Content>
          </Card>
        ) : (
          exercises.map(exercise => (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <Card.Content>
                <View style={styles.exerciseHeader}>
                  <Title style={styles.exerciseType}>{exercise.type}</Title>
                  <Chip mode="outlined" style={styles.intensityChip}>
                    {exercise.intensity}
                  </Chip>
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetail}>
                    <Ionicons name="time" size={16} /> {exercise.duration} minutes
                  </Text>
                  <Text style={styles.exerciseDetail}>
                    <Ionicons name="flame" size={16} /> {exercise.calories} kcal
                  </Text>
                </View>
                <Text style={styles.exerciseTime}>
                  {new Date(exercise.startTime).toLocaleString()}
                </Text>
                {exercise.notes && (
                  <Text style={styles.exerciseNotes}>Note: {exercise.notes}</Text>
                )}
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Log Exercise</Title>
          
          <Text style={styles.label}>Exercise Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {EXERCISE_TYPES.map(type => (
              <Chip
                key={type.name}
                selected={selectedType === type.name}
                onPress={() => setSelectedType(type.name)}
                style={styles.typeChip}
                mode={selectedType === type.name ? 'flat' : 'outlined'}
              >
                {type.name}
              </Chip>
            ))}
          </ScrollView>

          <TextInput
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          <Text style={styles.label}>Intensity</Text>
          <View style={styles.intensityRow}>
            {['low', 'moderate', 'high'].map(level => (
              <Chip
                key={level}
                selected={intensity === level}
                onPress={() => setIntensity(level)}
                style={styles.intensityOption}
                mode={intensity === level ? 'flat' : 'outlined'}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Chip>
            ))}
          </View>

          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleAddExercise}
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 15,
    marginTop: 20,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    margin: 15,
    paddingVertical: 8,
  },
  historyTitle: {
    fontSize: 20,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  emptyCard: {
    margin: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
  },
  exerciseCard: {
    margin: 15,
    marginTop: 0,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseType: {
    fontSize: 18,
  },
  intensityChip: {
    height: 28,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
  },
  exerciseTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  exerciseNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
    color: '#666',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  typeScroll: {
    marginBottom: 15,
  },
  typeChip: {
    marginRight: 8,
  },
  input: {
    marginBottom: 15,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  intensityOption: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});
