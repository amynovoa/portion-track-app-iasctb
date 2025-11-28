
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface ProgressRingProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({ 
  current, 
  target, 
  size = 80, 
  strokeWidth = 8 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / target, 1);
  const strokeDashoffset = circumference * (1 - progress);
  
  const isOverTarget = current > target;
  const progressColor = isOverTarget ? colors.highlight : colors.primary;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <svg width={size} height={size} style={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.card}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <View style={styles.textContainer}>
        <Text style={styles.currentText}>{current}</Text>
        <Text style={styles.targetText}>/{target}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
