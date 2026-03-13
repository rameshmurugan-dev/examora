/**
 * ================================================================
 * QuestionBankModals
 * ================================================================
 * Handles all modal dialogs for Question Bank:
 *
 *  - Section Create / Edit
 *  - SubSection Create / Edit
 *  - Question Create / Edit
 *  - Delete Confirmation
 * ================================================================
 */

import Modal from '../../../../shared/components/Modal';
import ConfirmDialog from '../../../../shared/components/ConfirmDialog';

const QuestionBankModals = ({
  currentItem,
  formData,
  setFormData,

  isSectionModalOpen,
  setIsSectionModalOpen,

  isSubSectionModalOpen,
  setIsSubSectionModalOpen,

  isQuestionModalOpen,
  setIsQuestionModalOpen,

  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,

  handleSaveSection,
  handleSaveSubSection,
  handleSaveQuestion,
  executeDelete,

  Icons
}) => {

  return (
    <>
      {/* ============================================================
         SECTION MODAL
      ============================================================ */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title={`${currentItem?.action} Section`}
        footer={
          <>
            <button
              onClick={handleSaveSection}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>

            <button
              onClick={() => setIsSectionModalOpen(false)}
              className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4">

          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              className="mt-1 w-full border rounded-md p-2"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />
          </div>

          {/* Section Description */}
          <div>
            <label className="block text-sm font-medium">
              Description
            </label>

            <textarea
              className="mt-1 w-full border rounded-md p-2"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
            />
          </div>

        </div>
      </Modal>


      {/* ============================================================
         SUBSECTION MODAL
      ============================================================ */}
      <Modal
        isOpen={isSubSectionModalOpen}
        onClose={() => setIsSubSectionModalOpen(false)}
        title={`${currentItem?.action} SubSection`}
        footer={
          <>
            <button
              onClick={handleSaveSubSection}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>

            <button
              onClick={() => setIsSubSectionModalOpen(false)}
              className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4">

          {/* SubSection Name */}
          <div>
            <label className="block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              className="mt-1 w-full border rounded-md p-2"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />
          </div>

          {/* SubSection Description */}
          <div>
            <label className="block text-sm font-medium">
              Description
            </label>

            <textarea
              className="mt-1 w-full border rounded-md p-2"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
            />
          </div>

        </div>
      </Modal>


      {/* ============================================================
         QUESTION MODAL
      ============================================================ */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={`${currentItem?.action} Question`}
        footer={
          <>
            <button
              onClick={handleSaveQuestion}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>

            <button
              onClick={() => setIsQuestionModalOpen(false)}
              className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium">
              Question Text
            </label>

            <textarea
              rows={3}
              className="mt-1 w-full border rounded-md p-2"
              value={formData.text || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  text: e.target.value
                })
              }
            />
          </div>

          {/* Marks */}
          <div>
            <label className="block text-sm font-medium">
              Marks
            </label>

            <input
              type="number"
              min={1}
              className="mt-1 w-24 border rounded-md p-2"
              value={formData.marks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  marks:
                    e.target.value === ''
                      ? ''
                      : Number(e.target.value)
                })
              }
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium">
              Difficulty
            </label>

            <select
              className="mt-1 border rounded-md p-2"
              value={formData.difficultyLevel || 'EASY'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  difficultyLevel: e.target.value
                })
              }
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>

          {/* Options */}
          <div>

            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                Options
              </label>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    options: [
                      ...formData.options,
                      { text: '', isCorrect: false }
                    ]
                  })
                }
                className="text-xs text-indigo-600"
              >
                + Add Option
              </button>
            </div>

            <div className="space-y-2">

              {formData.options?.map((opt, idx) => (

                <div
                  key={idx}
                  className="flex items-center gap-2"
                >

                  {/* Correct Option Radio */}
                  <input
                    type="radio"
                    name="correct"
                    checked={opt.isCorrect}
                    onChange={() => {
                      const updated =
                        formData.options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx
                        }));

                      setFormData({
                        ...formData,
                        options: updated
                      });
                    }}
                  />

                  {/* Option Text */}
                  <input
                    type="text"
                    className="flex-1 border rounded-md p-1.5 text-sm"
                    value={opt.text}
                    onChange={(e) => {
                      const updated = [...formData.options];
                      updated[idx].text = e.target.value;

                      setFormData({
                        ...formData,
                        options: updated
                      });
                    }}
                  />

                  {/* Remove Option (Min 2 remain) */}
                  {formData.options.length > 2 && (
                    <button
                      onClick={() => {
                        const updated =
                          formData.options.filter(
                            (_, i) => i !== idx
                          );

                        setFormData({
                          ...formData,
                          options: updated
                        });
                      }}
                      className="text-red-400"
                    >
                      <Icons.Trash />
                    </button>
                  )}

                </div>

              ))}

            </div>

          </div>

        </div>
      </Modal>


      {/* ============================================================
         DELETE CONFIRMATION
      ============================================================ */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={executeDelete}
        title={`Delete ${currentItem?.type?.toLowerCase()}`}
        message={`Are you sure you want to delete this ${currentItem?.type?.toLowerCase()}?`}
        confirmText="Delete"
        isDangerous
      />

    </>
  );
};

export default QuestionBankModals;