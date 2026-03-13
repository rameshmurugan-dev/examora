/**
 * ================================================================
 * BulkQuestionUploadModal
 * ================================================================
 * Handles CSV bulk upload for questions.
 *
 * Responsibilities:
 *  - Accept CSV file
 *  - Trigger bulk upload API
 *  - Show result summary
 *  - Display errors (if any)
 * ================================================================
 */

import { useState } from 'react';
import { bulkUploadQuestionsAPI } from '../services/questionBankService';

const BulkQuestionUploadModal = ({
  subSectionId,
  onClose,
  onSuccess
}) => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle CSV Upload
   */
  const upload = async () => {

    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    setLoading(true);

    try {
      const result = await bulkUploadQuestionsAPI(
        subSectionId,
        file
      );

      // EXACT SAME SUMMARY FORMAT
      alert(
        `Bulk Upload Completed\n\n` +
        `Total Rows: ${result.total}\n` +
        `Created: ${result.created}\n` +
        `Skipped: ${result.skipped}\n` +
        `Errors: ${result.errors.length}`
      );

      if (result.errors.length > 0) {
        alert('Errors:\n' + result.errors.join('\n'));
      }

      onSuccess();
      onClose();

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">

        <h2 className="font-semibold text-lg">
          Bulk Upload Questions
        </h2>

        <div className="text-sm text-gray-500">
          Upload Excel (XLSX) or CSV with 4 options per question.
        </div>

        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm"
        />

        <div className="flex justify-end gap-3 pt-2">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={!file || loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? 'Uploading…' : 'Upload'}
          </button>

        </div>

      </div>
    </div>
  );
};

export default BulkQuestionUploadModal;