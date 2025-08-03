import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

class CrashLogger {
  private static logPath = Platform.OS === 'web' ? 'crash.log' : `${FileSystem.documentDirectory}crash.log`;
  private static initialized = false;
  private static webLogs: string[] = [];

  static async init() {
    if (this.initialized) return;
    this.initialized = true;
    
    await this.cleanOldLogs();
    await this.logAppStart();
  }

  private static async cleanOldLogs() {
    try {
      if (Platform.OS === 'web') {
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        this.webLogs = this.webLogs.filter(line => {
          const match = line.match(/\[(\d{4}-\d{2}-\d{2}T[^\]]+)\]/);
          if (!match) return true;
          return new Date(match[1]).getTime() > threeDaysAgo;
        });
        return;
      }
      
      const exists = await FileSystem.getInfoAsync(this.logPath);
      if (!exists.exists) return;
      
      const content = await FileSystem.readAsStringAsync(this.logPath);
      const lines = content.split('\n');
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      
      const filteredLines = lines.filter(line => {
        const match = line.match(/\[(\d{4}-\d{2}-\d{2}T[^\]]+)\]/);
        if (!match) return true;
        return new Date(match[1]).getTime() > threeDaysAgo;
      });
      
      await FileSystem.writeAsStringAsync(this.logPath, filteredLines.join('\n'));
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }

  private static async logAppStart() {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [APP_START] Application started\n`;
    
    try {
      if (Platform.OS === 'web') {
        this.webLogs.push(logEntry);
        return;
      }
      
      await FileSystem.writeAsStringAsync(this.logPath, logEntry, {
        encoding: FileSystem.EncodingType.UTF8,
        append: true,
      });
    } catch (error) {
      console.error('Failed to log app start:', error);
    }
  }

  static async logError(error: Error, context?: string) {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] ${context ? `[${context}] ` : ''}${error.name}: ${error.message}\nStack: ${error.stack}\n\n`;
      
      if (Platform.OS === 'web') {
        this.webLogs.push(logEntry);
        return;
      }
      
      await FileSystem.writeAsStringAsync(this.logPath, logEntry, {
        encoding: FileSystem.EncodingType.UTF8,
        append: true,
      });
    } catch (logError) {
      console.error('Failed to write crash log:', logError);
    }
  }

  static async getCrashLog(): Promise<string> {
    try {
      if (Platform.OS === 'web') {
        return this.webLogs.length > 0 ? this.webLogs.join('') : 'No crash log found';
      }
      
      const exists = await FileSystem.getInfoAsync(this.logPath);
      if (exists.exists) {
        return await FileSystem.readAsStringAsync(this.logPath);
      }
      return 'No crash log found';
    } catch (error) {
      return 'Error reading crash log';
    }
  }

  static async clearCrashLog() {
    try {
      if (Platform.OS === 'web') {
        this.webLogs = [];
        return;
      }
      
      await FileSystem.deleteAsync(this.logPath, { idempotent: true });
    } catch (error) {
      console.error('Failed to clear crash log:', error);
    }
  }
}

export { CrashLogger };