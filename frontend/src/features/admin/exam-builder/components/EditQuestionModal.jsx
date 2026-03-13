import { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { updateExamQuestion } from '../services/examBuilderService';

/**
 * EditQuestionModal
 * Edits exam-only copied question
 */
const EditQuestionModal = ({ isOpen, onClose, question, onSaved, examId }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (question) {
      setForm({
        questionText: question.questionText,
        options: [...question.options],
        correctOption: question.correctOption,
        marks: question.marks,
      });
    }
  }, [question]);

  if (!form) return null;

  const handleSave = async () => {

    if (!form.questionText.trim()) {
      alert("Question text cannot be empty");
      return;
    }

    try {
      await updateExamQuestion(examId, question.id, form);
      onSaved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed updating question');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Exam Question"
      footer={
        <>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">
            Cancel
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <textarea
          className="w-full border rounded-lg p-2"
          value={form.questionText}
          onChange={e => setForm({ ...form, questionText: e.target.value })}
        />

        {form.options.map((opt, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="radio"
              checked={form.correctOption === opt}
              onChange={() => setForm({ ...form, correctOption: opt })}
            />
            <input
              className="flex-1 border rounded-lg p-1"
              value={opt}
              onChange={e => {
                const updated = [...form.options];
                updated[idx] = e.target.value;
                setForm({ ...form, options: updated });
              }}
            />
          </div>
        ))}

        <input
          type="number"
          className="border rounded-lg p-2 w-24"
          value={form.marks}
          onChange={e => setForm({ ...form, marks: Number(e.target.value) })}
        />
      </div>
    </Modal>
  );
};

export default EditQuestionModal;