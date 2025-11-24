export interface PatientData {
  age: string;
  gender: 'Male' | 'Female';
  totalBilirubin: string;
  directBilirubin: string;
  alkalinePhosphotase: string;
  alamineAminotransferase: string;
  aspartateAminotransferase: string;
  totalProteins: string;
  albumin: string;
  albuminGlobulinRatio: string;
}

export interface PredictionResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  probability: number;
  analysis: string;
  recommendations: string[];
}

export interface User {
  id: string;
  name: string;
  role: 'physician' | 'admin';
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ClaimData {
  claimAmount: string;
  patientAge: string;
  patientGender: 'Male' | 'Female';
  providerSpecialty: string;
  claimStatus: string;
  patientIncome: string;
  patientMaritalStatus: string;
  patientEmploymentStatus: string;
  providerLocation: string;
  claimType: string;
  claimSubmissionMethod: string;
  diseaseSeverity: string;
}

export interface ClaimPredictionResult {
  isFraud: boolean;
  riskScore: number; // 0-100
  reasoning: string;
  flaggedFields: string[];
}
