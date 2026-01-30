
import React, { useState } from 'react';
import { Candidate, CandidateStatus } from '../types';
import { ROLES, AREAS } from '../constants';
import CandidateCard from '../components/CandidateCard';

interface RecruiterViewProps {
  candidates: Candidate[];
  onAddCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'lastUpdated' | 'status' | 'documents'>) => void;
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
}

const RecruiterView: React.FC<RecruiterViewProps> = ({ candidates, onAddCandidate, onUpdateStatus }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: AREAS[0],
    role: ROLES[0],
    availability: 'Morning' as 'Morning' | 'Evening'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    onAddCandidate(formData);
    setFormData({ name: '', phone: '', area: AREAS[0], role: ROLES[0], availability: 'Morning' });
  };

  const intakeCandidates = candidates.filter(c => 
    [CandidateStatus.NEW, CandidateStatus.INTERVIEW_SCHEDULED, CandidateStatus.CONFIRMED].includes(c.status)
  );

  return (
    <div className="space-y-8">
      {/* Intake Form */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📝</span> New Candidate Intake
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Candidate Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <select
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <div className="flex gap-4 p-1 bg-gray-100 rounded-xl md:col-span-2">
            {(['Morning', 'Evening'] as const).map(time => (
              <button
                key={time}
                type="button"
                onClick={() => setFormData({ ...formData, availability: time })}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  formData.availability === time ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'
                }`}
              >
                {time} Shift
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full md:col-span-2 bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Add Candidate
          </button>
        </form>
      </section>

      {/* Active Pipeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🎯 Active Intake ({intakeCandidates.length})</h2>
          <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Last 24 Hours</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intakeCandidates.length === 0 ? (
            <p className="text-gray-500 col-span-2 py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
              No new candidates yet. Use the form above to start!
            </p>
          ) : (
            intakeCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                actions={
                  <>
                    {candidate.status === CandidateStatus.NEW && (
                      <button
                        onClick={() => onUpdateStatus(candidate.id, CandidateStatus.INTERVIEW_SCHEDULED)}
                        className="flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
                      >
                        Schedule Interview
                      </button>
                    )}
                    {candidate.status === CandidateStatus.INTERVIEW_SCHEDULED && (
                      <button
                        onClick={() => onUpdateStatus(candidate.id, CandidateStatus.CONFIRMED)}
                        className="flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold"
                      >
                        Mark Confirmed
                      </button>
                    )}
                  </>
                }
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default RecruiterView;
