
import React from 'react';
import { Candidate, CandidateStatus } from '../types';
import CandidateCard from '../components/CandidateCard';

interface HRViewProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
  onUpdateDocs: (id: string, docs: { aadhaar: boolean; bank: boolean }) => void;
}

const HRView: React.FC<HRViewProps> = ({ candidates, onUpdateStatus, onUpdateDocs }) => {
  const selectedCandidates = candidates.filter(c => 
    [CandidateStatus.SELECTED, CandidateStatus.DOCUMENT_PENDING, CandidateStatus.DOCUMENT_COMPLETED].includes(c.status)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 Document Verification</h2>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          {selectedCandidates.length} Selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedCandidates.length === 0 ? (
          <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400">Waiting for selections from interviewers...</p>
          </div>
        ) : (
          selectedCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              actions={
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪪</span>
                      <span className="text-sm font-medium">Aadhaar Card</span>
                    </div>
                    <button
                      onClick={() => onUpdateDocs(candidate.id, { ...candidate.documents, aadhaar: !candidate.documents.aadhaar })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        candidate.documents.aadhaar ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {candidate.documents.aadhaar ? 'Received' : 'Pending'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏦</span>
                      <span className="text-sm font-medium">Bank Details</span>
                    </div>
                    <button
                      onClick={() => onUpdateDocs(candidate.id, { ...candidate.documents, bank: !candidate.documents.bank })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        candidate.documents.bank ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {candidate.documents.bank ? 'Received' : 'Pending'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {candidate.documents.aadhaar && candidate.documents.bank && candidate.status !== CandidateStatus.DOCUMENT_COMPLETED && (
                      <button
                        onClick={() => onUpdateStatus(candidate.id, CandidateStatus.DOCUMENT_COMPLETED)}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm"
                      >
                        Verify & Complete Docs
                      </button>
                    )}
                    {candidate.status === CandidateStatus.DOCUMENT_COMPLETED && (
                      <button
                        onClick={() => onUpdateStatus(candidate.id, CandidateStatus.JOINED)}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm"
                      >
                        Mark as Joined 🤝
                      </button>
                    )}
                  </div>
                </div>
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HRView;
