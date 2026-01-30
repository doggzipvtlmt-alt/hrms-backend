
import React from 'react';
import { Candidate, CandidateStatus } from '../types';
import { STATUS_CONFIG } from '../constants';

interface CandidateCardProps {
  candidate: Candidate;
  onStatusChange?: (id: string, newStatus: CandidateStatus) => void;
  actions?: React.ReactNode;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onStatusChange, actions }) => {
  const config = STATUS_CONFIG[candidate.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-500">{candidate.phone}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color} flex items-center gap-1`}>
          <span>{config.icon}</span>
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-2 mb-4">
        <div className="text-xs">
          <p className="text-gray-400 uppercase font-bold tracking-wider">Role</p>
          <p className="text-gray-700 font-medium">{candidate.role}</p>
        </div>
        <div className="text-xs">
          <p className="text-gray-400 uppercase font-bold tracking-wider">Area</p>
          <p className="text-gray-700 font-medium">{candidate.area}</p>
        </div>
        <div className="text-xs">
          <p className="text-gray-400 uppercase font-bold tracking-wider">Availability</p>
          <p className="text-gray-700 font-medium">{candidate.availability}</p>
        </div>
        <div className="text-xs">
          <p className="text-gray-400 uppercase font-bold tracking-wider">Added</p>
          <p className="text-gray-700 font-medium">{new Date(candidate.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {actions && <div className="border-t pt-3 flex gap-2 overflow-x-auto no-scrollbar">{actions}</div>}
    </div>
  );
};

export default CandidateCard;
