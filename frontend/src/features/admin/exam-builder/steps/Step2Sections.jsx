/**
 * Step2Sections
 * Allows admin to attach / detach exam sections
 */
import { useState, useEffect } from 'react';

const Step2Sections = ({
  sections,
  structure,
  onAttach,
  onNext,
  onPrevious,
}) => {
  const [selected, setSelected] = useState([]);

  // Sync selected sections from backend structure
  useEffect(() => {
    if (structure?.sections) {
      const attachedIds = structure.sections.map(sec => sec.sectionId);
      setSelected(attachedIds);
    }
  }, [structure]);

  const handleClick = async (sectionId) => {
    try {
      await onAttach(sectionId);

      // Optimistic UI toggle
      setSelected(prev =>
        prev.includes(sectionId)
          ? prev.filter(id => id !== sectionId)
          : [...prev, sectionId]
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Section operation failed');
    }
  };

  const handleContinue = () => {
    if (!selected.length) {
      alert('Please select at least one section');
      return;
    }

    onNext();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Select Sections
      </h2>

      {/* Sections Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sections.map(sec => {
          const isSelected = selected.includes(sec.id);

          return (
            <button
              key={sec.id}
              onClick={() => handleClick(sec.id)}
              className={`border rounded-lg p-3 text-sm transition-all
                ${isSelected
                  ? 'bg-green-50 border-green-300 text-green-700 shadow-sm'
                  : 'border-gray-300 hover:bg-indigo-50'
                }`}
            >
              <div className="flex justify-between items-center">
                <span>{sec.name}</span>
                {isSelected && (
                  <span className="text-xs font-semibold">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Previous
        </button>

        <button
          onClick={handleContinue}
          disabled={!selected.length}
          className={`px-4 py-2 rounded-lg text-white transition-all
            ${selected.length
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step2Sections;