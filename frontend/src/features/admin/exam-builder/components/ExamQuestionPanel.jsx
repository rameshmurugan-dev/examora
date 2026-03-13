import { useState } from 'react';
import ExamQuestionRow from './ExamQuestionRow';

/**
 * ExamQuestionPanel
 * Displays sections → subsections → expandable question managers
 */
const ExamQuestionPanel = ({ structure, refresh, examId }) => {
  const [activeSubSectionId, setActiveSubSectionId] = useState(null);

  if (!structure?.sections?.length) {
    return (
      <div className="bg-white p-6 rounded-xl border text-gray-500">
        No sections / questions configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {structure.sections.map(section => (
        <div
          key={section.examSectionId}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="px-5 py-3 border-b bg-gray-50 rounded-t-2xl">
            <h3 className="font-semibold text-gray-800">{section.title}</h3>
          </div>

          <div className="p-4 space-y-4">
            {section.subSections.map(sub => {
              const isOpen = activeSubSectionId === sub.examSubSectionId;

              return (
                <div key={sub.examSubSectionId} className="border rounded-xl">
                  {/* Header */}
                  <div
                    onClick={() =>
                      setActiveSubSectionId(isOpen ? null : sub.examSubSectionId)
                    }
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold text-indigo-700">
                        {sub.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Active: {sub.activeQuestionCount} | Limit:{' '}
                        {sub.questionLimit || 0}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      {isOpen ? '▲' : '▼'}
                    </div>
                  </div>

                  {/* Content */}
                  {isOpen && (
                    <div className="p-4 border-t bg-gray-50">
                      <ExamQuestionRow
                        examSubSectionId={sub.examSubSectionId}
                        refresh={refresh}
                        examId={examId}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamQuestionPanel;