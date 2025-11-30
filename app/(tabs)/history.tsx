
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { formatDate } from '@/utils/dateUtils';
import { useAppContext } from '@/contexts/AppContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function HistoryScreen() {
  const { allLogs } = useAppContext();
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  console.log('=== HistoryScreen render ===');
  console.log('allLogs length:', allLogs.length);

  const sortedLogs = [...allLogs].sort((a, b) => b.date.localeCompare(a.date));

  const handleLogPress = (log: any) => {
    setSelectedLog(log);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLog(null);
  };

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
        {sortedLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="clock.fill"
              android_material_icon_name="history"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>Start tracking to see your history!</Text>
          </View>
        ) : (
          sortedLogs.map((log, index) => (
            <TouchableOpacity
              key={index}
              style={styles.logRow}
              onPress={() => handleLogPress(log)}
              activeOpacity={0.7}
            >
              <Text style={styles.logDate}>{formatDate(log.date)}</Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedLog ? formatDate(selectedLog.date) : ''}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={28}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {selectedLog && (
              <ScrollView style={styles.modalScroll}>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Protein</Text>
                    <Text style={styles.detailValue}>{selectedLog.protein}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Veggies</Text>
                    <Text style={styles.detailValue}>{selectedLog.veggies}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Fruit</Text>
                    <Text style={styles.detailValue}>{selectedLog.fruit}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Whole Grains</Text>
                    <Text style={styles.detailValue}>{selectedLog.wholeGrains}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Fats</Text>
                    <Text style={styles.detailValue}>{selectedLog.fats}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Nuts & Seeds</Text>
                    <Text style={styles.detailValue}>{selectedLog.nutsSeeds}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Legumes</Text>
                    <Text style={styles.detailValue}>{selectedLog.legumes}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Water</Text>
                    <Text style={styles.detailValue}>{selectedLog.water}</Text>
                  </View>
                  {selectedLog.alcohol !== undefined && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Alcohol</Text>
                      <Text style={styles.detailValue}>{selectedLog.alcohol}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Portions</Text>
                  <Text style={styles.totalValue}>
                    {selectedLog.protein + selectedLog.veggies + selectedLog.fruit + 
                     selectedLog.wholeGrains + selectedLog.fats + selectedLog.nutsSeeds + 
                     selectedLog.legumes + selectedLog.water + (selectedLog.alcohol || 0)}
                  </Text>
                </View>
              </ScrollView>
            )}
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 20,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  detailItem: {
    width: '30%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  totalContainer: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.background,
  },
});
