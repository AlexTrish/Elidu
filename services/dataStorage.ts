import AsyncStorage from '@react-native-async-storage/async-storage';

export interface University {
  id: string;
  name: string;
  url?: string;
  budgetSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  budgetSeats: number;
  admissionList: any[];
  lastUpdated: Date;
  shareableLink?: string;
  editableLink?: string;
}

const UNIVERSITIES_KEY = '@admission_tracker_universities';
const PROGRAMS_KEY = '@admission_tracker_programs';

export class DataStorage {
  static async getUniversities(): Promise<University[]> {
    try {
      const data = await AsyncStorage.getItem(UNIVERSITIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading universities:', error);
      return [];
    }
  }

  static async saveUniversities(universities: University[]): Promise<void> {
    try {
      await AsyncStorage.setItem(UNIVERSITIES_KEY, JSON.stringify(universities));
    } catch (error) {
      console.error('Error saving universities:', error);
    }
  }

  static async getPrograms(): Promise<Program[]> {
    try {
      const data = await AsyncStorage.getItem(PROGRAMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading programs:', error);
      return [];
    }
  }

  static async savePrograms(programs: Program[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
    } catch (error) {
      console.error('Error saving programs:', error);
    }
  }

  static async addUniversity(university: Omit<University, 'id' | 'createdAt' | 'updatedAt'>): Promise<University> {
    const universities = await this.getUniversities();
    const newUniversity: University = {
      ...university,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    universities.push(newUniversity);
    await this.saveUniversities(universities);
    return newUniversity;
  }

  static async updateUniversity(id: string, updates: Partial<University>): Promise<void> {
    const universities = await this.getUniversities();
    const index = universities.findIndex(u => u.id === id);
    
    if (index !== -1) {
      universities[index] = {
        ...universities[index],
        ...updates,
        updatedAt: new Date(),
      };
      await this.saveUniversities(universities);
    }
  }

  static async deleteUniversity(id: string): Promise<void> {
    const universities = await this.getUniversities();
    const programs = await this.getPrograms();
    
    const filteredUniversities = universities.filter(u => u.id !== id);
    const filteredPrograms = programs.filter(p => p.universityId !== id);
    
    await this.saveUniversities(filteredUniversities);
    await this.savePrograms(filteredPrograms);
  }

  static async addProgram(program: Omit<Program, 'id' | 'lastUpdated'>): Promise<Program> {
    const programs = await this.getPrograms();
    const newProgram: Program = {
      ...program,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    
    programs.push(newProgram);
    await this.savePrograms(programs);
    return newProgram;
  }

  static async updateProgram(id: string, updates: Partial<Program>): Promise<void> {
    const programs = await this.getPrograms();
    const index = programs.findIndex(p => p.id === id);
    
    if (index !== -1) {
      programs[index] = {
        ...programs[index],
        ...updates,
        lastUpdated: new Date(),
      };
      await this.savePrograms(programs);
    }
  }

  static async deleteProgram(id: string): Promise<void> {
    const programs = await this.getPrograms();
    const filteredPrograms = programs.filter(p => p.id !== id);
    await this.savePrograms(filteredPrograms);
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([UNIVERSITIES_KEY, PROGRAMS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}