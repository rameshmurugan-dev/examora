import { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetchBankQuestions, addQuestionFromBank } from '../services/examBuilderService';

/**
 * AddQuestionModal
 * Allows manual selection of bank questions
 */
const AddQuestionModal = ({ isOpen, onClose, examId, subSectionId, onAdded }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) loadQuestions();
  }, [isOpen]);

  const loadQuestions = async () => {
    try {
      const res = await fetchBankQuestions(subSectionId);
      setQuestions(res.data.data.content || []);
    } catch {
      alert('Failed loading bank questions');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleAdd = async () => {
    try {
      await Promise.all(selectedIds.map(id => addQuestionFromBank(examId, id)));
      onAdded();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed adding');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Questions from Bank"
      footer={
        <>
          <button
            onClick={handleAdd}
            disabled={!selectedIds.length}
            className={`px-4 py-2 rounded-lg text-white ${selectedIds.length
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            Add Selected
          </button>
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">
            Cancel
          </button>
        </>
      }
    >
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {questions.map(q => (
          <div
            key={q.id}
            onClick={() => toggleSelect(q.id)}
            className={`p-2 border rounded cursor-pointer text-sm ${selectedIds.includes(q.id)
                ? 'bg-indigo-50 border-indigo-300'
                : 'bg-gray-50'
              }`}
          >
            {q.questionText}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AddQuestionModal;