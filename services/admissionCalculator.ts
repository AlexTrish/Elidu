export interface AdmissionListEntry {
  orderNumber: number;
  priority: number;
  consentSubmitted: string;
  totalScore: number;
  examScore: number;
  achievementScore: number;
  status: string;
  participantId: string;
  selectionDate?: string;
}

export interface UniversityProgram {
  id: string;
  universityId: string;
  name: string;
  budgetSeats: number;
  admissionList: AdmissionListEntry[];
  lastUpdated: Date;
}

export interface PositionResult {
  generalPosition: number;
  priorityPosition: number;
  admissionChance: number;
  totalParticipants: number;
  participantsWithConsent: number;
}

export class AdmissionCalculator {
  static parseAdmissionTable(csvData: string): AdmissionListEntry[] {
    const lines = csvData.trim().split('\n');
    const entries: AdmissionListEntry[] = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split('\t');
      
      if (columns.length >= 8) {
        const entry: AdmissionListEntry = {
          orderNumber: parseInt(columns[0]) || 0,
          priority: parseInt(columns[1]) || 1,
          consentSubmitted: columns[2] || '—',
          totalScore: parseFloat(columns[3]) || 0,
          examScore: parseFloat(columns[4]) || 0,
          achievementScore: parseFloat(columns[5]) || 0,
          status: columns[6] || '',
          participantId: columns[7] || '',
          selectionDate: columns[8] || undefined,
        };
        
        entries.push(entry);
      }
    }
    
    return entries;
  }

  static calculatePosition(
    admissionList: AdmissionListEntry[],
    userParticipantId: string,
    budgetSeats: number
  ): PositionResult | null {
    // 1. Фильтруем только участников конкурса
    const competingParticipants = admissionList.filter(
      entry => entry.status === 'Участвуете в конкурсе'
    );

    // 2. Находим пользователя
    const userEntry = competingParticipants.find(
      entry => entry.participantId === userParticipantId
    );

    if (!userEntry) {
      return null;
    }

    // 3. Фильтруем по согласию: исключаем тех, у кого "—", но оставляем пользователя
    const participantsWithConsent = competingParticipants.filter(
      entry => entry.consentSubmitted !== '—' || entry.participantId === userParticipantId
    );

    // 4. Сортируем по баллам (по убыванию) для общей позиции
    const sortedByScore = [...participantsWithConsent].sort((a, b) => b.totalScore - a.totalScore);
    const generalPosition = sortedByScore.findIndex(entry => entry.participantId === userParticipantId) + 1;

    // 5. Сортируем по приоритету (по возрастанию) для позиции по приоритету
    const sortedByPriority = [...participantsWithConsent].sort((a, b) => a.priority - b.priority);
    const priorityPosition = sortedByPriority.findIndex(entry => entry.participantId === userParticipantId) + 1;

    // 6. Вычисляем шансы поступления
    const averagePosition = (generalPosition + priorityPosition) / 2;
    const admissionChance = Math.min(100, Math.max(0, (budgetSeats / averagePosition) * 100));

    return {
      generalPosition,
      priorityPosition,
      admissionChance: Math.round(admissionChance),
      totalParticipants: competingParticipants.length,
      participantsWithConsent: participantsWithConsent.length,
    };
  }

  // static generateShareableLink(universityId: string, programId: string, participantId: string): string {
  //   const baseUrl = 'https://admission-tracker.app'; // В реальном приложении это будет ваш домен
  //   return `${baseUrl}/track/${universityId}/${programId}/${participantId}`;
  // }

  // static generateEditableLink(universityId: string, programId: string): string {
  //   const baseUrl = 'https://admission-tracker.app';
  //   const editToken = Math.random().toString(36).substring(2, 15);
  //   return `${baseUrl}/edit/${universityId}/${programId}/${editToken}`;
  // }
}