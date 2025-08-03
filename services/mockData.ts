export const mockData = {
  universities: [
    {
      id: '1',
      name: 'Moscow Institute of Physics and Technology',
      url: 'https://mipt.ru',
      budgetSeats: 25,
    },
    {
      id: '2',
      name: 'Moscow State University',
      url: 'https://msu.ru',
      budgetSeats: 40,
    },
    {
      id: '3',
      name: 'Higher School of Economics',
      url: 'https://hse.ru',
      budgetSeats: 50,
    },
  ],
  programs: [
    {
      id: '1',
      universityId: '1',
      name: 'Applied Mathematics',
      budgetSeats: 25,
      admissionList: [],
      lastUpdated: new Date(),
      userPosition: {
        generalPosition: 22,
        priorityPosition: 18,
        admissionChance: 60,
      },
    },
    {
      id: '2',
      universityId: '1',
      name: 'Computer Science',
      budgetSeats: 30,
      admissionList: [],
      lastUpdated: new Date(),
      userPosition: {
        generalPosition: 35,
        priorityPosition: 28,
        admissionChance: 25,
      },
    },
    {
      id: '3',
      universityId: '2',
      name: 'Mathematics',
      budgetSeats: 40,
      admissionList: [],
      lastUpdated: new Date(),
      userPosition: {
        generalPosition: 15,
        priorityPosition: 12,
        admissionChance: 85,
      },
    },
    {
      id: '4',
      universityId: '3',
      name: 'Economics',
      budgetSeats: 50,
      admissionList: [],
      lastUpdated: new Date(),
      userPosition: {
        generalPosition: 45,
        priorityPosition: 35,
        admissionChance: 45,
      },
    },
  ],
};