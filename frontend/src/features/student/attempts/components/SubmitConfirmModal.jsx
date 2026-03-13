/**
 * ================================================================
 * SubmitConfirmModal
 * ================================================================
 * Confirmation modal shown before final exam submission.
 *
 * Displays:
 *  - Warning message
 *  - Answered / Unanswered summary
 *  - Submit / Cancel actions
 * ================================================================
 */

const SubmitConfirmModal = ({
    isOpen,
    onClose,
    onSubmit,
    summary
}) => {

    /* ============================================================
       Defensive Summary Defaults
    ============================================================ */

    const total = Number(summary?.total) || 0;
    const answered = Number(summary?.answered) || 0;
    const unanswered = total - answered;

    /* ============================================================
       Render
    ============================================================ */

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>

            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

                {/* Overlay */}
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                {/* Modal Panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                        <div className="sm:flex sm:items-start">

                            {/* Icon */}
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">

                                <h3
                                    className="text-lg leading-6 font-medium text-gray-900"
                                    id="modal-title"
                                >
                                    Submit Exam?
                                </h3>

                                <div className="mt-2">

                                    <p className="text-sm text-gray-500 mb-4">
                                        Are you sure you want to finish this exam? You cannot change your answers after submitting.
                                    </p>

                                    {/* Summary */}
                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-2">

                                        <div className="grid grid-cols-2 gap-2 text-sm">

                                            <div>
                                                <span className="block text-gray-500 text-xs uppercase">
                                                    Answered
                                                </span>
                                                <span className="font-bold text-green-600">
                                                    {answered}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="block text-gray-500 text-xs uppercase">
                                                    Unanswered
                                                </span>
                                                <span className="font-bold text-red-600">
                                                    {unanswered}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">

                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onSubmit}
                        >
                            Yes, Submit Exam
                        </button>

                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SubmitConfirmModal;