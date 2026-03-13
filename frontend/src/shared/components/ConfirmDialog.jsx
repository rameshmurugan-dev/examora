/**
 * ConfirmDialog
 * Reusable confirmation modal for destructive / important actions.
 */

import { useCallback } from 'react';
import Modal from '../../shared/components/Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) => {

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={handleConfirm}
            className={`
              w-full inline-flex justify-center
              rounded-md border border-transparent
              shadow-sm px-4 py-2 text-base font-medium text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2
              sm:ml-3 sm:w-auto sm:text-sm
              ${isDangerous
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }
            `}
          >
            {confirmText}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="
              mt-3 w-full inline-flex justify-center
              rounded-md border border-gray-300
              shadow-sm px-4 py-2 bg-white
              text-base font-medium text-gray-700
              hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-indigo-500
              sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
            "
          >
            {cancelText}
          </button>
        </>
      }
    >
      <div className="text-sm text-gray-500">
        {message}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;