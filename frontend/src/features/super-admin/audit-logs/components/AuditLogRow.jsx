/**
 * Audit Log Table Row
 * Displays single audit entry.
 */
const AuditLogRow = ({ log }) => {
  const formattedDate = new Date(log.timestamp).toLocaleString();

  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50 transition">
      
      <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
        {formattedDate}
      </td>

      <td className="px-6 py-3 text-sm font-medium text-gray-800">
        {log.actorName}
      </td>

      <td className="px-6 py-3 text-sm text-gray-600">
        {log.actorEmail}
      </td>

      <td className="px-6 py-3">
        <span
          className="
            inline-flex items-center
            bg-indigo-50 text-indigo-700
            px-2.5 py-1 rounded-md
            text-xs font-medium font-mono
          "
        >
          {log.action}
        </span>
      </td>

      <td className="px-6 py-3 text-sm text-gray-500">
        {log.description}
      </td>
    </tr>
  );
};

export default AuditLogRow;