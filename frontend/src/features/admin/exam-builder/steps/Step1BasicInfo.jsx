/**
 * Step1BasicInfo
 * Collects initial exam configuration (Total Marks auto-calculated)
 */
const Step1BasicInfo = ({ examData, setExamData, onNext }) => {

  const handleChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field, value) => {
    handleChange(field, value === '' ? '' : Number(value));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!examData.title?.trim()) {
      alert('Exam title is required');
      return;
    }

    if (!examData.durationMinutes || examData.durationMinutes <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    if (examData.negativeMarks < 0) {
      alert('Negative marks cannot be negative');
      return;
    }

    onNext();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">
        Basic Exam Information
      </h2>

      <div className="space-y-4">

        {/* Exam Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Exam Title
          </label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            value={examData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            value={examData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-medium">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            value={examData.durationMinutes}
            onChange={(e) =>
              handleNumberChange('durationMinutes', e.target.value)
            }
          />
        </div>

        {/* Negative Marks */}
        <div>
          <label className="text-sm font-medium">
            Negative Marks (per wrong question)
          </label>
          <input
            type="number"
            min="0"
            step="0.25"
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            value={examData.negativeMarks}
            onChange={(e) => {

              const val = e.target.value;

              if (val === '') {
                handleChange('negativeMarks', 0);
                return;
              }

              const value = Math.max(0, Number(val));
              handleChange('negativeMarks', value);
            }}
          />
        </div>

        {/* Exam Mode */}
        <div>
          <label className="text-sm font-medium">
            Exam Mode
          </label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            value={examData.examMode}
            onChange={(e) =>
              handleChange('examMode', e.target.value)
            }
          >
            <option value="FULL">FULL</option>
            <option value="SECTION">SECTION</option>
            <option value="SUBSECTION">SUBSECTION</option>
          </select>
        </div>

        {/* Info Note */}
        <div className="text-xs text-gray-500 bg-indigo-50 border border-indigo-100 rounded-lg p-2">
          ℹ️ Total marks will be calculated automatically from assigned questions.
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg
                       hover:bg-indigo-700 transition-all shadow-sm"
          >
            Save & Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default Step1BasicInfo;