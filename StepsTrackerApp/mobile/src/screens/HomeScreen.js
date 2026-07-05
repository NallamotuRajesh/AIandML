import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSteps } from '../context/StepsContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { todaySteps, dailyGoal, progress, isPedometerAvailable } = useSteps();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const distance = (todaySteps * 0.000762).toFixed(2);
  const calories = Math.round(todaySteps * 0.04);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.greeting}>{greeting}, {user?.username}!</Title>
        <Paragraph style={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Paragraph>
      </View>

      {!isPedometerAvailable && (
        <Card style={styles.warningCard}>
          <Card.Content>
            <Text style={styles.warningText}>
              Pedometer not available on this device. Steps may not be tracked accurately.
            </Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.mainCard}>
        <Card.Content style={styles.mainCardContent}>
          <View style={styles.stepsCircle}>
            <Ionicons name="footsteps" size={50} color="#6200ee" />
            <Title style={styles.stepsCount}>{todaySteps.toLocaleString()}</Title>
            <Text style={styles.stepsLabel}>steps today</Text>
          </View>
          
          <View style={styles.goalSection}>
            <Text style={styles.goalText}>Goal: {dailyGoal.toLocaleString()}</Text>
            <ProgressBar 
              progress={progress / 100} 
              color="#6200ee" 
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>{Math.round(progress)}% of daily goal</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="navigate" size={30} color="#ff6b6b" />
            <Title style={styles.statValue}>{distance}</Title>
            <Text style={styles.statLabel}>km</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="flame" size={30} color="#ff9f43" />
            <Title style={styles.statValue}>{calories}</Title>
            <Text style={styles.statLabel}>kcal</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title style={styles.tipsTitle}>💡 Daily Tip</Title>
          <Paragraph>
            Try to take short walking breaks every hour. It helps maintain consistent activity throughout the day!
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
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
  greeting: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  warningCard: {
    margin: 15,
    backgroundColor: '#fff3cd',
  },
  warningText: {
    color: '#856404',
  },
  mainCard: {
    margin: 15,
    marginTop: 20,
    elevation: 4,
  },
  mainCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  stepsCircle: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepsCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 10,
  },
  stepsLabel: {
    fontSize: 16,
    color: '#666',
  },
  goalSection: {
    width: '100%',
    paddingHorizontal: 20,
  },
  goalText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  tipsCard: {
    margin: 15,
    marginTop: 20,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
