
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAppContext } from '@/contexts/AppContext';
import { storage } from '@/utils/storage';
import { DailyLog, Goal, Sex } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';
import { calculatePortionPlan, portionPlanToDailyTargets } from '@/utils/targetUtils';

const goalOptions: Goal[] = ['Lose weight', 'Maintain', 'Gain muscle', 'Eat healthier'];
const sexOptions: Sex[] = ['Male', 'Female', 'Prefer not to say'];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, allLogs, refreshData, setUser, setTargets } = useAppContext();
  const [showRecalcModal, setShowRecalcModal] = useState(false);
  const [recalcGoal, setRecalcGoal] = useState<Goal>(user?.goal || 'Maintain');
  const [recalcWeight, setRecalcWeight] = useState(user?.currentWeight?.toString() || '');
  const [recalcSex, setRecalcSex] = useState<Sex>(user?.sex || 'Prefer not to say');
  const [recalcTarget, setRecalcTarget] = useState(user?.targetWeight?.toString() || '');

  useFocusEffect(
    useCallback(() => {
      console.log('=== Settings screen focused ===');
      refreshData();
    }, [refreshData])
  );

  const handleExportData = async () => {
    try {
      const csvHeader = 'Date,Protein,Veggies,Fruit,Whole Grains,Fats,Nuts & Seeds,Legumes,Dairy,Water,Alcohol\n';
      const csvRows = allLogs.map((log: DailyLog) => 
        `${log.date},${log.protein},${log.veggies},${log.fruit},${log.wholeGrains},${log.fats},${log.nutsSeeds},${log.legumes},${log.dairy},${log.water},${log.alcohol}`
      ).join('\n');
      
      const csvContent = csvHeader + csvRows;
      
      Alert.alert(
        'Export Data',
        'CSV data is ready. In a production app, this would be saved to a file or shared.',
        [
          { text: 'OK' }
        ]
      );
      
      console.log('CSV Export:\n', csvContent);
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clearAll();
              router.replace('/');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRecalculate = async () => {
    const weight = parseFloat(recalcWeight);
    if (!recalcWeight || isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid current weight.');
      return;
    }

    const targetWeight = recalcTarget ? parseFloat(recalcTarget) : undefined;

    // Calculate new portion plan
    const newPortionPlan = calculatePortionPlan(recalcGoal, recalcSex, weight, targetWeight);
    
    // Update user data
    const updatedUser = {
      ...user!,
      goal: recalcGoal,
      sex: recalcSex,
      currentWeight: weight,
      targetWeight,
      portionPlan: newPortionPlan,
    };

    // Convert to daily targets
    const newTargets = portionPlanToDailyTargets(newPortionPlan);

    try {
      await setUser(updatedUser);
      await setTargets(newTargets);
      setShowRecalcModal(false);
      Alert.alert('Success', 'Your portion plan has been recalculated!');
    } catch (error) {
      console.error('Error recalculating plan:', error);
      Alert.alert('Error', 'Failed to recalculate plan. Please try again.');
    }
  };

  const openRecalcModal = () => {
    setRecalcGoal(user?.goal || 'Maintain');
    setRecalcWeight(user?.currentWeight?.toString() || '');
    setRecalcSex(user?.sex || 'Prefer not to say');
    setRecalcTarget(user?.targetWeight?.toString() || '');
    setShowRecalcModal(true);
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/c120b509-3f86-4f37-80ee-1220bafc3458.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portion Plan</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openRecalcModal}
          >
            <IconSymbol
              ios_icon_name="arrow.triangle.2.circlepath"
              android_material_icon_name="refresh"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Recalculate Portion Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navigationRow}
            onPress={() => router.push('/(tabs)/daily-targets')}
          >
            <Text style={styles.navigationLabel}>Customize My Daily Targets</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Goal</Text>
            <Text style={styles.infoValue}>{user.goal}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Diet Style</Text>
            <Text style={styles.infoValue}>{user.dietStyle}</Text>
          </View>
          {user.sex && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sex</Text>
              <Text style={styles.infoValue}>{user.sex}</Text>
            </View>
          )}
          {user.currentWeight && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Current Weight</Text>
              <Text style={styles.infoValue}>{user.currentWeight} lbs</Text>
            </View>
          )}
          {user.targetWeight && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Target Weight</Text>
              <Text style={styles.infoValue}>{user.targetWeight} lbs</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reset Time</Text>
            <Text style={styles.infoValue}>{user.resetTime}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <IconSymbol
              ios_icon_name="square.and.arrow.up"
              android_material_icon_name="file_upload"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Export Data as CSV</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={handleResetData}>
            <IconSymbol
              ios_icon_name="trash"
              android_material_icon_name="delete"
              size={24}
              color={colors.warning}
            />
            <Text style={[styles.actionButtonText, styles.dangerText]}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.privacyNote}>
            🔒 Privacy Note: All your data stays on your device unless you export it.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showRecalcModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRecalcModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recalculate Portion Plan</Text>
              <TouchableOpacity onPress={() => setShowRecalcModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Goal</Text>
                <View style={styles.optionsGrid}>
                  {goalOptions.map((goal) => (
                    <TouchableOpacity
                      key={goal}
                      style={[styles.optionChip, recalcGoal === goal && styles.optionChipSelected]}
                      onPress={() => setRecalcGoal(goal)}
                    >
                      <Text style={[styles.optionChipText, recalcGoal === goal && styles.optionChipTextSelected]}>
                        {goal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Current Weight (lbs)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter weight"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={recalcWeight}
                  onChangeText={setRecalcWeight}
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Sex</Text>
                <View style={styles.optionsGrid}>
                  {sexOptions.map((sex) => (
                    <TouchableOpacity
                      key={sex}
                      style={[styles.optionChip, recalcSex === sex && styles.optionChipSelected]}
                      onPress={() => setRecalcSex(sex)}
                    >
                      <Text style={[styles.optionChipText, recalcSex === sex && styles.optionChipTextSelected]}>
                        {sex}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Target Weight (optional, lbs)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter target weight"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={recalcTarget}
                  onChangeText={setRecalcTarget}
                />
              </View>

              <TouchableOpacity style={styles.recalcButton} onPress={handleRecalculate}>
                <Text style={styles.recalcButtonText}>Recalculate</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    height: 160,
    width: 160,
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  text: {
    color: colors.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  navigationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.warning,
  },
  dangerText: {
    color: colors.warning,
  },
  privacyNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  optionChipTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  recalcButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  recalcButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
