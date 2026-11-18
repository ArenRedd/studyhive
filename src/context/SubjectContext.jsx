import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUBJECTS } from '@/data/subjectsData';

const SubjectContext = createContext(null);

const STORAGE_SUBJECT_KEY = 'studyhive_selected_subject';
const STORAGE_SUBJECT_ID_KEY = 'studyhive_selected_subject_id';

export function getStoredSubject() {
  try {
    const raw = localStorage.getItem(STORAGE_SUBJECT_KEY);
    const id = localStorage.getItem(STORAGE_SUBJECT_ID_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const match = SUBJECTS.find((s) => s.code.toLowerCase() === (parsed.code || '').toLowerCase());
      if (match) return match;
    }
    if (id) {
      const match = SUBJECTS.find((s) => s.code.toLowerCase() === id.toLowerCase());
      if (match) return match;
    }
  } catch {}
  return SUBJECTS[0];
}

export function SubjectProvider({ children }) {
  const [currentSubject, setCurrentSubjectState] = useState(getStoredSubject);

  const selectSubject = (subjectOrCode) => {
    let target = null;
    if (typeof subjectOrCode === 'string') {
      target = SUBJECTS.find((s) => s.code.toLowerCase() === subjectOrCode.toLowerCase());
    } else if (subjectOrCode && subjectOrCode.code) {
      target = SUBJECTS.find((s) => s.code.toLowerCase() === subjectOrCode.code.toLowerCase()) || subjectOrCode;
    }
    if (!target) target = SUBJECTS[0];

    setCurrentSubjectState(target);
    try {
      localStorage.setItem(STORAGE_SUBJECT_KEY, JSON.stringify(target));
      localStorage.setItem(STORAGE_SUBJECT_ID_KEY, target.code);
    } catch {}
    return target;
  };

  const getSubject = (code) => {
    if (!code) return currentSubject;
    return SUBJECTS.find((s) => s.code.toLowerCase() === code.toLowerCase()) || currentSubject;
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects: SUBJECTS,
        currentSubject,
        selectSubject,
        getSubject,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubject() {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
}
