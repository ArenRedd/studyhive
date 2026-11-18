import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProgress } from '@/components/ProgressProvider';
import { useSubject } from '@/context/SubjectContext';
import HoneyJar from '@/components/HoneyJar';
import HiveStatus from '@/components/HiveStatus';
import UnitNests from '@/components/UnitNests';
import MainPanel from '@/components/MainPanel';
import HexConfetti from '@/components/HexConfetti';

export default function Dashboard() {
  const { subjectId } = useParams();
  const { currentSubject, selectSubject } = useSubject();

  useEffect(() => {
    if (subjectId) {
      selectSubject(subjectId);
    }
  }, [subjectId, selectSubject]);

  const {
    units = [],
    allQuestions = [],
    progress,
    completedSet,
    revisionSet,
    selectedUnit,
    selectedStat,
    questCount,
    questTarget,
    questComplete,
    celebrateAt,
    toggleQuestion,
    toggleRevision,
    completeQuestion,
    nextUnchecked,
    addQuestion,
    deleteQuestion,
  } = useProgress();

  const [tab, setTab] = useState('checklist');
  const [pulseId, setPulseId] = useState(null);
  const pulseTimer = useRef(null);

  const unit =
    units.find((u) => u.id === selectedUnit) ||
    units[0] || { id: 'I', title: 'Unit I', shortTitle: 'Unit I', questions: [] };

  const hasQuestions =
    currentSubject.code === 'CS3691' ||
    units.some((u) => u.questions && u.questions.length > 0);

  useEffect(() => () => window.clearTimeout(pulseTimer.current), []);

  const handleToggle = (questionId) => {
    toggleQuestion(questionId);
  };

  const handleContinue = () => {
    const nextId = nextUnchecked(selectedUnit);
    if (!nextId) return;
    setTab('checklist');
    setPulseId(nextId);
    window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setPulseId(null), 2600);
    window.setTimeout(() => {
      const element = document.querySelector(`[data-qid="${nextId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 340);
  };

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="px-3 pt-1 sm:px-4 lg:px-5">
        <div className="mx-auto flex w-full max-w-[1420px] flex-col gap-3 lg:flex-row lg:items-start">
          {hasQuestions && (
            <div className="flex w-full flex-col gap-3 lg:w-[300px] lg:shrink-0 xl:w-[336px]">
              <div className="px-1 pb-4 pt-2">
                <HoneyJar
                  percent={progress.percent}
                  completed={progress.completed}
                  total={progress.total}
                />
              </div>
              <HiveStatus />
              <UnitNests />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <MainPanel
              unit={unit}
              units={units}
              stat={selectedStat}
              tab={tab}
              onTabChange={setTab}
              completedSet={completedSet}
              revisionSet={revisionSet}
              revisionIds={revisionSet}
              allQuestions={allQuestions}
              onToggle={handleToggle}
              onStar={toggleRevision}
              onGotIt={completeQuestion}
              pulseId={pulseId}
              hasQuestions={hasQuestions}
              onAddQuestion={addQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {hasQuestions && <HexConfetti trigger={celebrateAt} />}

      <p className="sr-only" aria-live="polite">
        Subject {currentSubject.fullName} ({currentSubject.code}) selected.
      </p>
    </div>
  );
}
