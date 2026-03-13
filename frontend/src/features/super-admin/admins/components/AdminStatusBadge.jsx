/**
 * Admin Status Badge
 * Displays professional status indicator.
 */

const STATUS_STYLES = {
  INVITED: "bg-blue-100 text-blue-700",
  ACTIVATED: "bg-indigo-100 text-indigo-700",
  ACTIVE: "bg-green-100 text-green-700",
  IDLE: "bg-yellow-100 text-yellow-700",
  INACTIVE: "bg-red-100 text-red-700",
  BLOCKED: "bg-gray-200 text-gray-700",
  NEVER: "bg-gray-100 text-gray-600",
};

const AdminStatusBadge = ({ status }) => {
  const styleClass = STATUS_STYLES[status] || STATUS_STYLES.NEVER;

  return (
    <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${styleClass}`}>
      {status}
    </span>
  );
};

export default AdminStatusBadge;