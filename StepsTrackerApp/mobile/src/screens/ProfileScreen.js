import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, List, Button, TextInput, Portal, Modal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSteps } from '../context/StepsContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { dailyGoal, updateDailyGoal } = useSteps();
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoal.toString());

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal < 1000 || goal > 50000) {
      Alert.alert('Error', 'Please enter a valid goal between 1,000 and 50,000');
      return;
    }
    updateDailyGoal(goal);
    setModalVisible(false);
    Alert.alert('Success', 'Daily goal updated successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>
            {user?.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Title style={styles.username}>{user?.username}</Title>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Goals & Settings</Title>
            <List.Item
              title="Daily Step Goal"
              description={`${dailyGoal.toLocaleString()} steps`}
              left={props => <List.Icon {...props} icon="target" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setModalVisible(true)}
            />
            <List.Item
              title="Units"
              description="Metric (km, kg)"
              left={props => <List.Icon {...props} icon="ruler" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Notifications"
              description="Enabled"
              left={props => <List.Icon {...props} icon="bell" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>About</Title>
            <List.Item
              title="App Version"
              description="1.0.0"
              left={props => <List.Icon {...props} icon="information" />}
            />
            <List.Item
              title="Privacy Policy"
              left={props => <List.Icon {...props} icon="shield-check" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
              title="Terms of Service"
              left={props => <List.Icon {...props} icon="file-document" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#ff3b30"
        >
          Logout
        </Button>
      </ScrollView>

      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Set Daily Goal</Title>
          <Text style={styles.modalDescription}>
            Enter your daily step goal (1,000 - 50,000 steps)
          </Text>
          
          <TextInput
            label="Daily Step Goal"
            value={newGoal}
            onChangeText={setNewGoal}
            keyboardType="numeric"
            mode="outlined"
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
              onPress={handleUpdateGoal}
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
    alignItems: 'center',
    paddingBottom: 30,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  username: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 15,
    marginTop: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    margin: 15,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
  },
});
