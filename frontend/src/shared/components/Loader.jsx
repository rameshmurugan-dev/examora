/**
 * Loader
 * Displays a spinning indicator.
 * Supports full-screen overlay or inline mode.
 */

const Loader = ({ fullScreen = true }) => {

  const spinner = (
    <div
      className="
        w-12 h-12
        border-4 border-indigo-500
        border-t-transparent
        rounded-full
        animate-spin
      "
    />
  );

  if (fullScreen) {
    return (
      <div
        className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-gray-50 bg-opacity-75
        "
        role="status"
        aria-live="polite"
      >
        {spinner}
      </div>
    );
  }

  return (
    <div
      className="flex justify-center p-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="
          w-8 h-8
          border-4 border-indigo-500
          border-t-transparent
          rounded-full
          animate-spin
        "
      />
    </div>
  );
};

export default Loader;