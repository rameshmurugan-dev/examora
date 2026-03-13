import { useState } from 'react';
import { bulkUploadStudentsApi } from '../services/studentManagementService';

/**
 * Bulk Upload Students Modal
 */
const BulkStudentUploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) {
      alert('Please select a CSV file');
      return;
    }

    setLoading(true);

    try {
      const result = await bulkUploadStudentsApi(file);
      const data = result.data;

      alert(
        `Bulk Upload Completed\n\n` +
        `Total Rows: ${data.total}\n` +
        `Created: ${data.created}\n` +
        `Skipped: ${data.skipped}\n` +
        `Errors: ${data.errors.length}`
      );

      if (data.errors.length > 0) {
        alert('Errors:\n' + data.errors.join('\n'));
      }

      onSuccess();
      onClose();

    } catch (err) {
      console.error('UPLOAD ERROR:', err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="font-semibold">Bulk Upload Students</h2>

        <input
          type="file"
          accept=".csv"
          className="block w-full text-sm"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={upload}
            disabled={!file || loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkStudentUploadModal;