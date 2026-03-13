const ExamSummarySidebar = ({ structure }) => {
  if (!structure) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6 text-gray-400 text-sm">
        Exam not created yet.
      </div>
    );
  }

  const totalSections = structure.sections.length;

  const totalSubSections = structure.sections.reduce(
    (acc, sec) => acc + sec.subSections.length,
    0
  );

  const totalQuestions = structure.sections.reduce(
    (acc, sec) =>
      acc +
      sec.subSections.reduce(
        (sAcc, sub) => sAcc + sub.activeQuestionCount,
        0
      ),
    0
  );

  const health =
    totalSections === 0
      ? 20
      : totalSubSections === 0
        ? 40
        : totalQuestions === 0
          ? 70
          : 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-32">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
        Exam Summary
      </h3>

      {/* Completion Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Completion</span>
          <span className="font-semibold">{health}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full transition-all ${health < 50
                ? 'bg-red-500'
                : health < 80
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            style={{ width: `${health}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <SummaryItem label="Sections" value={totalSections} />
        <SummaryItem label="SubSections" value={totalSubSections} />
        <SummaryItem label="Active Questions" value={totalQuestions} />
        <SummaryItem
          label="Duration"
          value={`${structure.durationMinutes} mins`}
        />
        <SummaryItem label="Total Marks" value={structure.totalMarks} />
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2 last:border-none">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default ExamSummarySidebar;