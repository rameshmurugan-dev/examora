import ExamQuestionPanel from '../components/ExamQuestionPanel';

/**
 * Step4Questions
 * Question configuration & management
 */
const Step4Questions = ({
  structure,
  refreshStructure,
  onNext,
  onPrevious,
}) => {
  const totalActiveQuestions =
    structure?.sections?.reduce(
      (acc, sec) =>
        acc +
        sec.subSections.reduce(
          (sAcc, sub) => sAcc + sub.activeQuestionCount,
          0
        ),
      0
    ) || 0;

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-4 shadow-sm flex justify-between">
        <div>
          <div className="text-sm font-medium text-gray-600">
            Total Active Questions
          </div>
          <div className="text-xs text-gray-500">
            Click subsection to manage
          </div>
        </div>

        <span className="text-lg font-bold text-indigo-600">
          {totalActiveQuestions}
        </span>
      </div>

      <ExamQuestionPanel
        structure={structure}
        refresh={refreshStructure}
        examId={structure.examId}
      />

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Previous
        </button>

        <button
          disabled={!totalActiveQuestions}
          onClick={onNext}
          className={`px-4 py-2 rounded-lg text-white
            ${totalActiveQuestions
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default Step4Questions;