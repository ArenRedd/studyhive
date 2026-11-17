import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_COMPLETED, units } from '@/data/units';

const STORAGE_KEY = 'studyhive.progress.v2';

export const QUEST_TARGET = 3;
export const HONEY_PER_QUESTION = 10;
export const QUEST_REWARD = 50;

const pad = (value) => String(value).padStart(2, '0');

export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const previousDayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return dayKey(date);
};

const createDefaultState = () => ({
  completedIds: [...DEFAULT_COMPLETED],
  revisionIds: [],
  honey: 420,
  streak: 3,
  lastActive: dayKey(),
  questDate: dayKey(),
  questCount: 2,
  questComplete: false,
  selectedUnit: 'II',
  celebrateAt: 0,
});

const readState = () => {
  const base = createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    const merged = { ...base, ...parsed };
    if (!Array.isArray(merged.completedIds)) merged.completedIds = [...DEFAULT_COMPLETED];
    if (!Array.isArray(merged.revisionIds)) merged.revisionIds = [];
    // a celebration must never replay after a reload
    merged.celebrateAt = 0;
    // daily quest resets at local midnight
    if (merged.questDate !== dayKey()) {
      merged.questDate = dayKey();
      merged.questCount = 0;
      merged.questComplete = false;
    }
    return merged;
  } catch {
    return base;
  }
};

export function useProgressState() {
  const [state, setState] = useState(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — progress stays in memory */
    }
  }, [state]);

  // daily quest resets at local midnight, even with the tab left open
  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) =>
        prev.questDate === dayKey()
          ? prev
          : { ...prev, questDate: dayKey(), questCount: 0, questComplete: false },
      );
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  const completeQuestion = useCallback((questionId) => {
    setState((prev) => {
      if (prev.completedIds.includes(questionId)) return prev;
      const today = dayKey();
      const questCount = Math.min(QUEST_TARGET, prev.questCount + 1);
      const questJustCompleted = questCount >= QUEST_TARGET && !prev.questComplete;
      const streak =
        prev.lastActive === today
          ? prev.streak
          : prev.lastActive === previousDayKey()
            ? prev.streak + 1
            : 1;

      return {
        ...prev,
        completedIds: [...prev.completedIds, questionId],
        honey: prev.honey + HONEY_PER_QUESTION + (questJustCompleted ? QUEST_REWARD : 0),
        questCount,
        questComplete: prev.questComplete || questJustCompleted,
        questDate: today,
        lastActive: today,
        streak,
        celebrateAt: questJustCompleted ? Date.now() : prev.celebrateAt,
      };
    });
  }, []);

  const uncompleteQuestion = useCallback((questionId) => {
    setState((prev) => {
      if (!prev.completedIds.includes(questionId)) return prev;
      return {
        ...prev,
        completedIds: prev.completedIds.filter((id) => id !== questionId),
        honey: Math.max(0, prev.honey - HONEY_PER_QUESTION),
      };
    });
  }, []);

  const toggleQuestion = useCallback(
    (questionId) => {
      if (state.completedIds.includes(questionId)) uncompleteQuestion(questionId);
      else completeQuestion(questionId);
    },
    [state.completedIds, completeQuestion, uncompleteQuestion],
  );

  const toggleRevision = useCallback((questionId) => {
    setState((prev) => ({
      ...prev,
      revisionIds: prev.revisionIds.includes(questionId)
        ? prev.revisionIds.filter((id) => id !== questionId)
        : [...prev.revisionIds, questionId],
    }));
  }, []);

  const selectUnit = useCallback((unitId) => {
    setState((prev) => ({ ...prev, selectedUnit: unitId }));
  }, []);

  const progress = useMemo(() => {
    const done = new Set(state.completedIds);
    const perUnit = units.map((unit) => {
      const total = unit.questions.length;
      const completed = unit.questions.filter((question) => done.has(question.id)).length;
      return {
        id: unit.id,
        title: unit.title,
        shortTitle: unit.shortTitle,
        total,
        completed,
        remaining: total - completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
      };
    });
    const total = perUnit.reduce((sum, unit) => sum + unit.total, 0);
    const completed = perUnit.reduce((sum, unit) => sum + unit.completed, 0);
    return {
      perUnit,
      total,
      completed,
      remaining: total - completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
      byUnit: perUnit.reduce((acc, unit) => ({ ...acc, [unit.id]: unit }), {}),
    };
  }, [state.completedIds]);

  const completedSet = useMemo(() => new Set(state.completedIds), [state.completedIds]);
  const revisionSet = useMemo(() => new Set(state.revisionIds), [state.revisionIds]);

  const selectedUnit = state.selectedUnit;
  const selectedStat = progress.byUnit[selectedUnit] || progress.perUnit[0];

  const nextUnchecked = useCallback(
    (unitId) => {
      const unit = units.find((item) => item.id === unitId);
      if (!unit) return null;
      const done = new Set(state.completedIds);
      const next = unit.questions.find((question) => !done.has(question.id));
      return next ? next.id : null;
    },
    [state.completedIds],
  );

  return {
    state,
    completedIds: state.completedIds,
    completedSet,
    revisionIds: state.revisionIds,
    revisionSet,
    honey: state.honey,
    streak: state.streak,
    questCount: state.questCount,
    questTarget: QUEST_TARGET,
    questComplete: state.questComplete,
    celebrateAt: state.celebrateAt,
    selectedUnit,
    selectedStat,
    progress,
    toggleQuestion,
    completeQuestion,
    uncompleteQuestion,
    toggleRevision,
    selectUnit,
    nextUnchecked,
  };
}