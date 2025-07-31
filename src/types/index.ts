// Basic types for the application
export interface User {
  _id: string;
  name: string;
  email: string;
  type: 'Manager' | 'Engineer';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  department?: string;
  maxCapacity?: number;
  employmentType?: 'full-time' | 'part-time';
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: string;
}

export interface Assignment {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
  status: 'active' | 'completed' | 'cancelled';
}