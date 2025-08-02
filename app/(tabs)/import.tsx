import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Link, Upload, Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function ImportScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [webUrl, setWebUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const styles = createStyles(isDark);

  const handleWebImport = async () => {
    if (!webUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    setIsImporting(true);
    
    // Simulate import process
    try {
      // In a real app, you would use papaparse or similar to fetch and parse the data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setImportStatus('success');
      Alert.alert('Success', 'Data imported successfully!');
    } catch (error) {
      setImportStatus('error');
      Alert.alert('Error', 'Failed to import data. Please check the URL and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = () => {
    // In a real app, you would use expo-document-picker here
    Alert.alert(
      'File Import',
      'This feature will allow you to import CSV or Excel files from your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose File', onPress: () => {
          // Mock file import
          setIsImporting(true);
          setTimeout(() => {
            setIsImporting(false);
            setImportStatus('success');
            Alert.alert('Success', 'File imported successfully!');
          }, 1500);
        }}
      ]
    );
  };

  const handleExport = () => {
    Alert.alert(
      'Export Data',
      'Export your universities and programs data to CSV format',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // Mock export
          Alert.alert('Success', 'Data exported to Downloads folder');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Import & Export</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Web Import Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Link size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Import from Web</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Import data from Google Sheets or CSV URLs
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={webUrl}
              onChangeText={setWebUrl}
              placeholder="https://docs.google.com/spreadsheets/..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={[styles.importButton, isImporting && styles.importButtonDisabled]}
              onPress={handleWebImport}
              disabled={isImporting}
            >
              <Upload size={16} color="white" />
              <Text style={styles.importButtonText}>
                {isImporting ? 'Importing...' : 'Import'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formatInfo}>
            <Text style={styles.formatTitle}>Expected CSV Format:</Text>
            <Text style={styles.formatText}>
              University, Program, Budget Seats, Current Rank, Originals Above, Exam Score
            </Text>
          </View>
        </View>

        {/* File Import Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Import from File</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Upload CSV or Excel files from your device
          </Text>
          
          <TouchableOpacity 
            style={styles.fileImportButton}
            onPress={handleFileImport}
            disabled={isImporting}
          >
            <Upload size={24} color="#10B981" />
            <Text style={styles.fileImportText}>Choose File</Text>
            <Text style={styles.fileImportSubtext}>CSV, XLSX files supported</Text>
          </TouchableOpacity>
        </View>

        {/* Export Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Download size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Export Data</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Export your data to CSV format
          </Text>
          
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Download size={16} color="white" />
            <Text style={styles.exportButtonText}>Export to CSV</Text>
          </TouchableOpacity>
        </View>

        {/* Status Indicator */}
        {importStatus !== 'idle' && (
          <View style={styles.statusContainer}>
            {importStatus === 'success' ? (
              <View style={styles.statusItem}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.statusText}>Import completed successfully</Text>
              </View>
            ) : (
              <View style={styles.statusItem}>
                <AlertCircle size={20} color="#EF4444" />
                <Text style={styles.statusText}>Import failed</Text>
              </View>
            )}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Import Instructions</Text>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1.</Text>
            <Text style={styles.instructionText}>
              Prepare your data in CSV format with columns: University, Program, Budget Seats, Current Rank, Originals Above, Exam Score
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2.</Text>
            <Text style={styles.instructionText}>
              For Google Sheets, make sure the sheet is publicly accessible and get the CSV export URL
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3.</Text>
            <Text style={styles.instructionText}>
              Preview and validate data before confirming the import
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#111827' : '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
  },
  sectionDescription: {
    fontSize: 14,
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: isDark ? '#F9FAFB' : '#111827',
    backgroundColor: isDark ? '#374151' : '#F9FAFB',
    marginBottom: 12,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  formatInfo: {
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  formatTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 4,
  },
  formatText: {
    fontSize: 11,
    color: isDark ? '#9CA3AF' : '#6B7280',
    fontFamily: 'monospace',
  },
  fileImportButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  fileImportText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 8,
  },
  fileImportSubtext: {
    fontSize: 12,
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 4,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#4B5563',
  },
  instructionsSection: {
    backgroundColor: isDark ? '#1F2937' : 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F9FAFB' : '#111827',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#4B5563',
    lineHeight: 20,
  },
});