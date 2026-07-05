import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import StepsLineChart from '../components/StepsLineChart';
import StepsBarChart from '../components/StepsBarChart';
import ExercisePieChart from '../components/ExercisePieChart';

export default function StatsScreen() {
  const weeklyStats = {
    totalSteps: 52345,
    avgDailySteps: 7478,
    totalDistance: 39.8,
    totalCalories: 2094,
    activedays: 7,
  };

  const weeklyStepsData = [5000, 7000, 8500, 6500, 9000, 10500, 8000];
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Statistics</Title>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Weekly Overview</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="footsteps" size={32} color="#6200ee" />
                <Text style={styles.statValue}>{weeklyStats.totalSteps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Steps</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={32} color="#4ecdc4" />
                <Text style={styles.statValue}>{weeklyStats.avgDailySteps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Avg. Daily Steps</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="navigate" size={32} color="#ff6b6b" />
                <Text style={styles.statValue}>{weeklyStats.totalDistance}</Text>
                <Text style={styles.statLabel}>Distance (km)</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={32} color="#ff9f43" />
                <Text style={styles.statValue}>{weeklyStats.totalCalories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>7-Day Steps Trend</Title>
            <StepsLineChart data={weeklyStepsData} labels={weekLabels} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Daily Comparison</Title>
            <StepsBarChart data={weeklyStepsData} labels={weekLabels} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Exercise Distribution</Title>
            <ExercisePieChart />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Achievements</Title>
            <View style={styles.achievementsList}>
              <View style={styles.achievement}>
                <Ionicons name="trophy" size={40} color="#ffd700" />
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>7-Day Streak</Text>
                  <Text style={styles.achievementDesc}>Keep it up!</Text>
                </View>
              </View>
              <View style={styles.achievement}>
                <Ionicons name="medal" size={40} color="#c0c0c0" />
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>50K Steps</Text>
                  <Text style={styles.achievementDesc}>This week</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>AI Insights</Title>
            <View style={styles.insight}>
              <Ionicons name="bulb" size={24} color="#6200ee" />
              <Text style={styles.insightText}>
                Your activity has increased by 15% this week. Great progress!
              </Text>
            </View>
            <View style={styles.insight}>
              <Ionicons name="trending-up" size={24} color="#4ecdc4" />
              <Text style={styles.insightText}>
                You're most active on weekdays between 8-10 AM.
              </Text>
            </View>
            <View style={styles.insight}>
              <Ionicons name="alert-circle" size={24} color="#ff9f43" />
              <Text style={styles.insightText}>
                Try to increase weekend activity to maintain consistency.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  card: {
    margin: 15,
    marginTop: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsList: {
    gap: 15,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  achievementText: {
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});
