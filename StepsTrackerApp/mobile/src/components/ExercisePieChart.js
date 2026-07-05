import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ExercisePieChart({ data }) {
  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const defaultData = [
    {
      name: 'Running',
      population: 30,
      color: '#ff6b6b',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Walking',
      population: 25,
      color: '#4ecdc4',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Cycling',
      population: 20,
      color: '#45b7d1',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Gym',
      population: 15,
      color: '#f9ca24',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Yoga',
      population: 10,
      color: '#6c5ce7',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ];

  return (
    <View style={{ alignItems: 'center' }}>
      <PieChart
        data={data || defaultData}
        width={screenWidth - 60}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
