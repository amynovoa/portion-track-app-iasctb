
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { referenceOptions } from '@/data/referenceOptions';
import { FoodGroup, DietStyle } from '@/types';

interface HealthyOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  foodGroup: FoodGroup;
  dietStyle: DietStyle;
}

export default function HealthyOptionsSheet({
  visible,
  onClose,
  foodGroup,
  dietStyle,
}: HealthyOptionsSheetProps) {
  const data = referenceOptions[foodGroup];

  if (!data) return null;

  const sortedOptions = [...data.options].sort((a, b) => {
    const aDietMatch = a.diet === dietStyle || (dietStyle === 'vegetarian' && a.diet === 'vegan');
    const bDietMatch = b.diet === dietStyle || (dietStyle === 'vegetarian' && b.diet === 'vegan');

    if (aDietMatch && !bDietMatch) return -1;
    if (!aDietMatch && bDietMatch) return 1;
    return 0;
  });

  const getDietLabel = (diet: string) => {
    if (diet === 'vegan') return 'VG';
    if (diet === 'vegetarian') return 'V';
    return '';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.tipContainer}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.tip}>{data.tip}</Text>
            </View>

            <View style={styles.optionsList}>
              {sortedOptions.map((option, index) => (
                <View key={index} style={styles.optionItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.optionText}>{option.name}</Text>
                  {getDietLabel(option.diet) && (
                    <View style={styles.dietBadge}>
                      <Text style={styles.dietBadgeText}>{getDietLabel(option.diet)}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  tip: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  dietBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dietBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
});
