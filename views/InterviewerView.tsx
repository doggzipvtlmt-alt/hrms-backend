
import React, { useState } from 'react';
import { Candidate, CandidateStatus } from '../types';
import CandidateCard from '../components/CandidateCard';

interface InterviewerViewProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
}

const InterviewerView: React.FC<InterviewerViewProps> = ({ candidates, onUpdateStatus }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { // Simple simulation PIN
      setIsAuthenticated(true);
    } else {
      alert('Wrong PIN! Try 1234 for demo.');
    }
  };

  const todayInterviews = candidates.filter(c => 
    [CandidateStatus.CONFIRMED, CandidateStatus.INTERVIEW_SCHEDULED].includes(c.status)
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold mb-6">Interviewer Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-3xl tracking-[1rem] p-4 rounded-xl border-2 border-gray-200 outline-none focus:border-indigo-500"
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg">
            Open Dashboard
          </button>
          <p className="text-xs text-gray-400">Hint: Use 1234</p>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👋 Namaste, Amit</h2>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm text-red-500 font-medium">Log Out</button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
        <p className="text-indigo-700 font-bold">Today's Schedule</p>
        <p className="text-indigo-600 text-sm">You have {todayInterviews.length} candidates to interview.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {todayInterviews.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-gray-500 font-medium">No more interviews for today!</p>
          </div>
        ) : (
          todayInterviews.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              actions={
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => onUpdateStatus(candidate.id, CandidateStatus.SELECTED)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold flex flex-col items-center"
                  >
                    <span>✅</span>
                    <span className="text-xs">SELECT</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(candidate.id, CandidateStatus.REJECTED)}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold flex flex-col items-center"
                  >
                    <span>❌</span>
                    <span className="text-xs">REJECT</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(candidate.id, CandidateStatus.HOLD)}
                    className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-bold flex flex-col items-center"
                  >
                    <span>🟡</span>
                    <span className="text-xs">HOLD</span>
                  </button>
                </div>
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewerView;
