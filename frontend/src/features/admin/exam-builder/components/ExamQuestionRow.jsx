import { useEffect, useState, useCallback } from 'react';
import {
  fetchQuestionsBySubSection,
  fetchExamSubSection,
  updateSubSectionSettings,
  generateQuestions,
  toggleQuestionRemoval,
} from '../services/examBuilderService';

import EditQuestionModal from './EditQuestionModal';
import AddQuestionModal from './AddQuestionModal';

/**
 * ExamQuestionRow
 * ------------------------------------------------------
 * Handles:
 * - subsection settings
 * - question generation
 * - manual editing
 * - soft deletion
 */
const ExamQuestionRow = ({ examSubSectionId, refresh, examId }) => {

  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const [originalSubSectionId, setOriginalSubSectionId] = useState(null);

  const [settings, setSettings] = useState({
    selectionMode: 'MANUAL',
    questionLimit: '',
    easyPercentage: '',
    mediumPercentage: '',
    hardPercentage: '',
    shuffleQuestions: false,
  });

  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------- */
  /* LOAD DATA */
  /* -------------------------------------------------- */

  const loadQuestions = useCallback(async () => {
    try {
      const res = await fetchQuestionsBySubSection(examSubSectionId);
      setQuestions(res.data.data.content || []);
    } catch {
      console.warn('Failed loading questions');
      setQuestions([]);
    }
  }, [examSubSectionId]);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetchExamSubSection(examSubSectionId);
      const sub = res.data.data;

      setOriginalSubSectionId(sub.subSectionId);

      setSettings({
        selectionMode: sub.selectionMode || 'MANUAL',
        questionLimit: sub.questionLimit || '',
        easyPercentage: sub.easyPercentage || '',
        mediumPercentage: sub.mediumPercentage || '',
        hardPercentage: sub.hardPercentage || '',
        shuffleQuestions: sub.shuffleQuestions || false,
      });

    } catch {
      console.warn('Failed loading settings');
    }
  }, [examSubSectionId]);

  useEffect(() => {
    loadQuestions();
    loadSettings();
  }, [loadQuestions, loadSettings]);

  /* -------------------------------------------------- */
  /* HELPERS */
  /* -------------------------------------------------- */

  const normalizeSettings = () => {

    const payload = {
      selectionMode: settings.selectionMode,
      questionLimit: settings.questionLimit
        ? Number(settings.questionLimit)
        : null,
      shuffleQuestions: settings.shuffleQuestions,
    };

    if (settings.selectionMode === 'SMART') {
      payload.easyPercentage = Number(settings.easyPercentage);
      payload.mediumPercentage = Number(settings.mediumPercentage);
      payload.hardPercentage = Number(settings.hardPercentage);
    }

    return payload;
  };

  const validateSmartDistribution = () => {

    const total =
      Number(settings.easyPercentage || 0) +
      Number(settings.mediumPercentage || 0) +
      Number(settings.hardPercentage || 0);

    return total === 100;
  };

  /* -------------------------------------------------- */
  /* SETTINGS SAVE */
  /* -------------------------------------------------- */

  const saveSettings = async () => {

    try {

      setLoading(true);

      await updateSubSectionSettings(
        examSubSectionId,
        normalizeSettings()
      );

      await loadSettings();
      await refresh();

    } catch (err) {

      alert(err.response?.data?.message || 'Save failed');

    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* GENERATE QUESTIONS */
  /* -------------------------------------------------- */

  const handleGenerate = async () => {

    if (!settings.questionLimit) {
      alert('Question limit required');
      return;
    }

    if (settings.selectionMode === 'SMART' && !validateSmartDistribution()) {
      alert('Difficulty percentages must equal 100%');
      return;
    }

    try {

      setLoading(true);

      await updateSubSectionSettings(
        examSubSectionId,
        normalizeSettings()
      );

      await generateQuestions(examSubSectionId);

      await loadQuestions();
      await refresh();

    } catch (err) {

      alert(err.response?.data?.message || 'Generation failed');

    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------- */
  /* REMOVE / RESTORE QUESTION */
  /* -------------------------------------------------- */

  const handleToggleRemove = async (q) => {

    try {

      await toggleQuestionRemoval(q.id, !q.isRemoved);

      await loadQuestions();
      await refresh();

    } catch (err) {

      alert(err.response?.data?.message || 'Action failed');

    }
  };

  /* -------------------------------------------------- */
  /* MODE SWITCH */
  /* -------------------------------------------------- */

  const handleModeChange = (mode) => {

    setSettings({
      selectionMode: mode,
      questionLimit: '',
      easyPercentage: '',
      mediumPercentage: '',
      hardPercentage: '',
      shuffleQuestions: false,
    });

    setQuestions([]);
  };

  /* -------------------------------------------------- */
  /* FILTERED QUESTIONS */
  /* -------------------------------------------------- */

  const filteredQuestions = questions.filter(q => {

    if (filter === 'ACTIVE') return !q.isRemoved;
    if (filter === 'REMOVED') return q.isRemoved;
    return true;

  });

  /* -------------------------------------------------- */
  /* UI */
  /* -------------------------------------------------- */

  return (
    <div className="space-y-3">

      {/* SETTINGS */}
      <div className="bg-gray-50 border rounded-xl p-4 space-y-3">

        <div className="flex flex-wrap gap-4 items-center">

          <select
            value={settings.selectionMode}
            onChange={e => handleModeChange(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="MANUAL">Manual</option>
            <option value="RANDOM">Random</option>
            <option value="SMART">Smart</option>
          </select>

          <input
            type="number"
            min="1"
            placeholder="Question Limit"
            value={settings.questionLimit}
            onChange={e =>
              setSettings({ ...settings, questionLimit: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm w-32"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.shuffleQuestions}
              onChange={e =>
                setSettings({ ...settings, shuffleQuestions: e.target.checked })
              }
            />
            Shuffle
          </label>

        </div>

        {settings.selectionMode === 'SMART' && (
          <div className="flex gap-3">
            {['easyPercentage', 'mediumPercentage', 'hardPercentage'].map(key => (
              <input
                key={key}
                type="number"
                min="0"
                max="100"
                placeholder={key.replace('Percentage', ' %')}
                value={settings[key]}
                onChange={e =>
                  setSettings({ ...settings, [key]: e.target.value })
                }
                className="border rounded px-2 py-1 text-sm w-24"
              />
            ))}
          </div>
        )}

        <button
          disabled={loading}
          onClick={
            settings.selectionMode === 'MANUAL'
              ? saveSettings
              : handleGenerate
          }
          className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
        >
          {settings.selectionMode === 'MANUAL'
            ? 'Save Settings'
            : 'Save & Generate'}
        </button>

      </div>

      {/* FILTER */}
      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="border rounded px-3 py-1 text-xs"
      >
        <option value="ALL">All</option>
        <option value="ACTIVE">Active</option>
        <option value="REMOVED">Removed</option>
      </select>

      {/* ADD BUTTON */}
      {settings.selectionMode === 'MANUAL' && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddOpen(true)}
            className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
          >
            + Add From Bank
          </button>
        </div>
      )}

      {/* QUESTIONS */}
      {filteredQuestions.map(q => (

        <div
          key={q.id}
          className={`rounded-xl border p-4 text-sm
            ${q.isRemoved
              ? 'bg-red-50 border-red-300 opacity-80'
              : 'bg-white'}
          `}
        >

          <div className="flex justify-between">

            <span className={q.isRemoved ? 'line-through text-red-700' : ''}>
              {q.questionText}
            </span>

            {settings.selectionMode === 'MANUAL' && (
              <div className="flex gap-2">

                <button
                  onClick={() => setEditing(q)}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleToggleRemove(q)}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                >
                  {q.isRemoved ? 'Restore' : 'Remove'}
                </button>

              </div>
            )}

          </div>

        </div>

      ))}

      {/* EDIT MODAL */}
      {editing && (
        <EditQuestionModal
          isOpen={!!editing}
          question={editing}
          examId={examId}
          onClose={() => setEditing(null)}
          onSaved={() => {
            loadQuestions();
            refresh();
          }}
        />
      )}

      {/* ADD MODAL */}
      {isAddOpen && originalSubSectionId && (
        <AddQuestionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          examId={examId}
          subSectionId={originalSubSectionId}
          onAdded={() => {
            loadQuestions();
            refresh();
          }}
        />
      )}

    </div>
  );
};

export default ExamQuestionRow;