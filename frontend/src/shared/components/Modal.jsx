/**
 * Modal
 * Generic reusable modal component.
 * Handles:
 * - Overlay click close
 * - Escape key close
 * - Body scroll lock
 */

import { useEffect, useCallback } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {

  const handleEscape = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-75"
        onClick={() => onClose?.()}
      />

      {/* Modal Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title}
          </h3>
        )}

        <div>{children}</div>

        {footer && (
          <div className="mt-6 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;