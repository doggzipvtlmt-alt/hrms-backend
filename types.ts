
export enum CandidateStatus {
  NEW = 'NEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  INTERVIEW_DONE = 'INTERVIEW_DONE',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
  HOLD = 'HOLD',
  DOCUMENT_PENDING = 'DOCUMENT_PENDING',
  DOCUMENT_COMPLETED = 'DOCUMENT_COMPLETED',
  JOINED = 'JOINED',
  DROPPED = 'DROPPED'
}

export interface Candidate {
  id: string;
  name: string;
  phone: string;
  area: string;
  role: string;
  availability: 'Morning' | 'Evening';
  status: CandidateStatus;
  createdAt: number;
  lastUpdated: number;
  documents: {
    aadhaar: boolean;
    bank: boolean;
  };
  interviewerId?: string;
}

export interface WhatsAppLog {
  id: string;
  candidateId: string;
  message: string;
  timestamp: number;
  type: 'outgoing' | 'incoming';
}

export enum UserRole {
  RECRUITER = 'RECRUITER',
  INTERVIEWER = 'INTERVIEWER',
  HR = 'HR',
  ADMIN = 'ADMIN'
}
