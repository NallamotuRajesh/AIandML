import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import * as Progress from 'react-native-progress';

export default function GoalProgressCard({ title, current, target, color = '#6200ee' }) {
  const progress = Math.min(current / target, 1);
  const percentage = Math.round(progress * 100);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            height={12}
            color={color}
            unfilledColor="#e0e0e0"
            borderWidth={0}
            borderRadius={6}
          />
        </View>
        <View style={styles.textContainer}>
          <Paragraph style={styles.currentText}>
            {current.toLocaleString()} / {target.toLocaleString()}
          </Paragraph>
          <Paragraph style={[styles.percentageText, { color }]}>
            {percentage}%
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentText: {
    fontSize: 14,
    color: '#666',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
