
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RecruiterView from './views/RecruiterView';
import InterviewerView from './views/InterviewerView';
import HRView from './views/HRView';
import AdminView from './views/AdminView';
import { Candidate, CandidateStatus, UserRole, WhatsAppLog } from './types';
import { generateWhatsAppMessage } from './services/geminiService';

const STORAGE_KEY = 'sahayak_candidates';
const LOGS_KEY = 'sahayak_logs';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppLog[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.RECRUITER);

  // Persistence
  useEffect(() => {
    const savedCandidates = localStorage.getItem(STORAGE_KEY);
    const savedLogs = localStorage.getItem(LOGS_KEY);
    if (savedCandidates) setCandidates(JSON.parse(savedCandidates));
    if (savedLogs) setWhatsappLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    localStorage.setItem(LOGS_KEY, JSON.stringify(whatsappLogs));
  }, [candidates, whatsappLogs]);

  const addCandidate = useCallback((data: Omit<Candidate, 'id' | 'createdAt' | 'lastUpdated' | 'status' | 'documents'>) => {
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: CandidateStatus.NEW,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      documents: { aadhaar: false, bank: false }
    };
    setCandidates(prev => [newCandidate, ...prev]);
  }, []);

  const updateStatus = useCallback(async (id: string, newStatus: CandidateStatus) => {
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus, lastUpdated: Date.now() } : c
    ));

    // Automate WhatsApp Message
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
      const message = await generateWhatsAppMessage(candidate, newStatus);
      const log: WhatsAppLog = {
        id: Math.random().toString(36).substr(2, 9),
        candidateId: id,
        message,
        timestamp: Date.now(),
        type: 'outgoing'
      };
      setWhatsappLogs(prev => [log, ...prev]);
    }
  }, [candidates]);

  const updateDocs = useCallback((id: string, docs: { aadhaar: boolean; bank: boolean }) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, documents: docs, lastUpdated: Date.now() };
        // Auto-transition to document pending if any docs added but not all
        if ((docs.aadhaar || docs.bank) && !(docs.aadhaar && docs.bank)) {
          updated.status = CandidateStatus.DOCUMENT_PENDING;
        }
        return updated;
      }
      return c;
    }));
  }, []);

  const renderView = () => {
    switch (activeRole) {
      case UserRole.RECRUITER:
        return <RecruiterView candidates={candidates} onAddCandidate={addCandidate} onUpdateStatus={updateStatus} />;
      case UserRole.INTERVIEWER:
        return <InterviewerView candidates={candidates} onUpdateStatus={updateStatus} />;
      case UserRole.HR:
        return <HRView candidates={candidates} onUpdateStatus={updateStatus} onUpdateDocs={updateDocs} />;
      case UserRole.ADMIN:
        return <AdminView candidates={candidates} whatsappLogs={whatsappLogs} />;
      default:
        return <div>Select a role to begin.</div>;
    }
  };

  return (
    <Layout activeRole={activeRole} setActiveRole={setActiveRole}>
      {renderView()}
    </Layout>
  );
};

export default App;
