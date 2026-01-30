
import React from 'react';
import { Candidate, CandidateStatus, WhatsAppLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminViewProps {
  candidates: Candidate[];
  whatsappLogs: WhatsAppLog[];
}

const AdminView: React.FC<AdminViewProps> = ({ candidates, whatsappLogs }) => {
  const metrics = {
    total: candidates.length,
    interviewsToday: candidates.filter(c => [CandidateStatus.CONFIRMED, CandidateStatus.INTERVIEW_SCHEDULED].includes(c.status)).length,
    selected: candidates.filter(c => c.status === CandidateStatus.SELECTED).length,
    joined: candidates.filter(c => c.status === CandidateStatus.JOINED).length,
    dropped: candidates.filter(c => c.status === CandidateStatus.DROPPED || c.status === CandidateStatus.REJECTED).length,
  };

  const chartData = [
    { name: 'New', count: candidates.filter(c => c.status === CandidateStatus.NEW).length, color: '#9ca3af' },
    { name: 'Scheduled', count: candidates.filter(c => c.status === CandidateStatus.INTERVIEW_SCHEDULED).length, color: '#3b82f6' },
    { name: 'Confirmed', count: candidates.filter(c => c.status === CandidateStatus.CONFIRMED).length, color: '#6366f1' },
    { name: 'Selected', count: candidates.filter(c => c.status === CandidateStatus.SELECTED).length, color: '#10b981' },
    { name: 'Joined', count: candidates.filter(c => c.status === CandidateStatus.JOINED).length, color: '#059669' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">🚀 Admin Dashboard</h2>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase">Total Intake</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase">Interviews Today</p>
          <p className="text-3xl font-bold text-indigo-600">{metrics.interviewsToday}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase">Selected</p>
          <p className="text-3xl font-bold text-green-600">{metrics.selected}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase">Joined</p>
          <p className="text-3xl font-bold text-emerald-600">{metrics.joined}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6">Recruitment Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WhatsApp Simulation Logs */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <h3 className="font-bold mb-4 flex items-center justify-between">
            <span>💬 WhatsApp Logs</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">LIVE</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {whatsappLogs.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-20">No messages sent yet...</p>
            ) : (
              whatsappLogs.map(log => (
                <div key={log.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">To: {candidates.find(c => c.id === log.candidateId)?.name}</span>
                    <span className="text-[9px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic">"{log.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
