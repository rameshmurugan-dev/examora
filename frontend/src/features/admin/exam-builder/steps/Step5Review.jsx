const Step5Review = ({
  structure,
  onPublish,
  onPrevious,
  onSaveDraft,
}) => {
  const totalQuestions = structure.sections.reduce(
    (acc, sec) =>
      acc +
      sec.subSections.reduce(
        (sAcc, sub) => sAcc + sub.activeQuestionCount,
        0
      ),
    0
  );

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Review Exam</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <ReviewItem label="Title" value={structure.title} />
        <ReviewItem label="Mode" value={structure.examMode} />
        <ReviewItem label="Duration" value={`${structure.durationMinutes} mins`} />
        <ReviewItem label="Total Questions" value={totalQuestions} />
        <ReviewItem label="Total Marks" value={structure.totalMarks} />
        <ReviewItem label="Negative Marks" value={structure.negativeMarks} />
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Previous
        </button>

        <div className="flex gap-3">
          <button
            onClick={onSaveDraft}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Save Draft
          </button>

          <button
            onClick={onPublish}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Publish Exam
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewItem = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="text-gray-500 text-xs">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default Step5Review;