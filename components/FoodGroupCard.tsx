
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import ProgressRing from './ProgressRing';
import { FoodGroup } from '@/types';

interface FoodGroupCardProps {
  group: FoodGroup;
  label: string;
  current: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onInfo: () => void;
  imageUrl?: string;
}

const foodGroupIcons: Record<FoodGroup, { ios: string; android: string }> = {
  protein: { ios: 'flame.fill', android: 'local_fire_department' },
  veggies: { ios: 'leaf.fill', android: 'eco' },
  fruit: { ios: 'apple.logo', android: 'apple' },
  wholeGrains: { ios: 'circle.grid.3x3.fill', android: 'grain' },
  fats: { ios: 'drop.fill', android: 'water_drop' },
  nutsSeeds: { ios: 'circle.fill', android: 'circle' },
  legumes: { ios: 'circle.hexagongrid.fill', android: 'apps' },
  water: { ios: 'drop.fill', android: 'water_drop' },
  alcohol: { ios: 'wineglass.fill', android: 'local_bar' },
  dairy: { ios: 'cup.and.saucer.fill', android: 'local_cafe' },
};

export default function FoodGroupCard({
  group,
  label,
  current,
  target,
  onIncrement,
  onDecrement,
  onInfo,
  imageUrl,
}: FoodGroupCardProps) {
  const isOverTarget = current > target;
  const icon = foodGroupIcons[group];

  return (
    <View style={[styles.card, isOverTarget && styles.cardOverTarget]}>
      <TouchableOpacity onPress={onInfo} style={styles.infoButton}>
        <IconSymbol
          ios_icon_name="info.circle"
          android_material_icon_name="info"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <IconSymbol
          ios_icon_name={icon.ios}
          android_material_icon_name={icon.android}
          size={32}
          color={colors.primary}
        />
      </View>

      <Text style={styles.label}>{label}</Text>

      <ProgressRing current={current} target={target} size={70} strokeWidth={6} />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onDecrement}
          style={[styles.button, styles.decrementButton]}
          disabled={current === 0}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onIncrement} style={[styles.button, styles.incrementButton]}>
          <Text style={[styles.buttonText, styles.incrementText]}>+1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    minHeight: 200,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  cardOverTarget: {
    backgroundColor: colors.highlight,
  },
  infoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  incrementButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  incrementText: {
    color: colors.background,
  },
});
