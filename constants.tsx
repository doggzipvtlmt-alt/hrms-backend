
import React from 'react';
import { CandidateStatus } from './types';

export const STATUS_CONFIG: Record<CandidateStatus, { label: string; color: string; icon: string }> = {
  [CandidateStatus.NEW]: { label: 'New', color: 'bg-gray-100 text-gray-700', icon: '🆕' },
  [CandidateStatus.INTERVIEW_SCHEDULED]: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: '📅' },
  [CandidateStatus.CONFIRMED]: { label: 'Confirmed', color: 'bg-indigo-100 text-indigo-700', icon: '✅' },
  [CandidateStatus.INTERVIEW_DONE]: { label: 'Interview Done', color: 'bg-purple-100 text-purple-700', icon: '🎤' },
  [CandidateStatus.SELECTED]: { label: 'Selected', color: 'bg-green-100 text-green-700', icon: '🌟' },
  [CandidateStatus.REJECTED]: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: '❌' },
  [CandidateStatus.HOLD]: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  [CandidateStatus.DOCUMENT_PENDING]: { label: 'Docs Pending', color: 'bg-orange-100 text-orange-700', icon: '📄' },
  [CandidateStatus.DOCUMENT_COMPLETED]: { label: 'Docs Done', color: 'bg-emerald-100 text-emerald-700', icon: '💼' },
  [CandidateStatus.JOINED]: { label: 'Joined', color: 'bg-teal-100 text-teal-700', icon: '🤝' },
  [CandidateStatus.DROPPED]: { label: 'Dropped', color: 'bg-rose-100 text-rose-700', icon: '🏃' },
};

export const ROLES = [
  'Delivery Partner',
  'Warehouse Executive',
  'Security Guard',
  'Housekeeping',
  'Data Entry',
  'Driver'
];

export const AREAS = [
  'Gurgaon',
  'Noida',
  'South Delhi',
  'East Delhi',
  'West Delhi',
  'Manesar'
];
