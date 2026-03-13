/**
 * ================================================================
 * QuestionRenderer
 * ================================================================
 * Renders question UI dynamically based on question type.
 *
 * Supports:
 *  - Single select (Radio)
 *  - Multiple select (Checkbox)
 * ================================================================
 */

const QuestionRenderer = ({
    question,
    savedAnswer,
    onAnswerChange
}) => {

    /* ============================================================
       Guard Clause
    ============================================================ */

    if (!question) {
        return <div>Loading question...</div>;
    }

    /* ============================================================
       Question Type Detection
    ============================================================ */

    const type = question.questionType;

    const isMCQ =
        type === 'MCQ' ||
        type === 'MULTIPLE_CHOICE';

    const isMultipleSelect =
        type === 'MULTIPLE_CHOICE';

    /* ============================================================
       Handle Change
    ============================================================ */

    const handleChange = (e) => {

        const value = e.target.value;

        if (isMultipleSelect) {
            const currentAnswers = Array.isArray(savedAnswer)
                ? savedAnswer
                : [];

            let updatedAnswers;

            if (e.target.checked) {
                updatedAnswers = [...currentAnswers, value];
            } else {
                updatedAnswers = currentAnswers.filter(v => v !== value);
            }

            onAnswerChange(updatedAnswers);

        } else {
            onAnswerChange(value);
        }
    };

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[300px]">

            {/* Question Header */}
            <div className="mb-6 pb-6 border-b border-gray-100">

                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded font-semibold mb-2">
                    {question.marks} Marks
                </span>

                <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                    {question.questionText}
                </h2>

            </div>

            {/* Options */}
            <div className="space-y-4">

                {question.options.map((option, idx) => {

                    const optionId = option.id ?? idx;

                    const isChecked = isMultipleSelect
                        ? Array.isArray(savedAnswer) &&
                        savedAnswer.includes(String(optionId))
                        : String(savedAnswer) === String(optionId);

                    return (
                        <label
                            key={optionId}
                            className={`
                                flex items-start p-4 border rounded-lg cursor-pointer transition-all
                                ${isChecked
                                    ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                                    : 'hover:bg-gray-50 border-gray-200'
                                }
                            `}
                        >
                            <input
                                type={isMultipleSelect ? 'checkbox' : 'radio'}
                                name={`question_${question.id}`}
                                value={optionId}
                                checked={isChecked}
                                onChange={handleChange}
                                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />

                            <span className="ml-3 text-gray-700 select-none">
                                {option.text}
                            </span>

                        </label>
                    );
                })}

            </div>

        </div>
    );
};

export default QuestionRenderer;