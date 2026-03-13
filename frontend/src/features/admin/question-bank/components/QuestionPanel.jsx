/**
 * ================================================================
 * QuestionPanel
 * ================================================================
 * Right panel of Question Bank.
 *
 * Responsibilities:
 *  - Display header
 *  - Bulk upload button
 *  - Create question button
 *  - Render question list
 *  - Render pagination
 *  - Show empty state
 * ================================================================
 */

import QuestionCard from './QuestionCard';

const QuestionPanel = ({
  questions,
  selectedSubSectionId,
  page,
  pageSize,
  totalPages,

  onBulkUpload,
  onCreateQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onPageChange,

  Icons
}) => {

  return (
    <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="px-5 py-4 border-b flex justify-between">

        <h2 className="text-lg font-semibold">
          {selectedSubSectionId ? 'Questions' : 'Select a Subsection'}
        </h2>

        {selectedSubSectionId && (
          <div className="flex gap-2">

            <button
              onClick={onBulkUpload}
              className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm border hover:bg-gray-200"
            >
              Bulk Upload
            </button>

            <button
              onClick={onCreateQuestion}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700"
            >
              <Icons.Plus /> New Question
            </button>

          </div>
        )}

      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">

        {/* Empty State */}
        {!questions.length ? (
          <p className="text-gray-400 text-center mt-10">
            No questions
          </p>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                page={page}
                pageSize={pageSize}
                onEditQuestion={onEditQuestion}
                onDeleteQuestion={onDeleteQuestion}
                Icons={Icons}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">

            <button
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page + 1} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default QuestionPanel;