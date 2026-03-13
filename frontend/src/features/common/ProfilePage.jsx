import { useAuth } from "../../core/context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  const roleInstructions = {
    SUPER_ADMIN:
      "As a Super Admin, you have full system control. You can manage administrators, monitor system activity, review audit logs, and maintain overall platform stability.",
    ADMIN:
      "As an Admin, you are responsible for managing exams, organizing sections and questions, and monitoring student performance through analytics.",
    STUDENT:
      "As a Student, you can attempt exams, review your results, track your progress, and improve your performance through consistent practice.",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information and review your account details.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">

        {/* User Info Section */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-800">
            Account Information
          </h2>
          <p className="text-sm text-gray-500">
            These details help identify your account within the Examora system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-2 mt-1 bg-gray-100 text-gray-600"
              defaultValue={user?.name || ""}
              disabled
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-500">Email Address</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-2 mt-1 bg-gray-100 text-gray-600"
              value={user?.email || ""}
              disabled
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <input
              className="w-full border border-gray-200 rounded-lg p-2 mt-1 bg-gray-100 text-gray-600"
              value={user?.role || ""}
              disabled
            />
          </div>

        </div>

      </div>

      {/* Role Guidance Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">

        <h2 className="text-lg font-semibold text-indigo-800 mb-2">
          Your Role in the System
        </h2>

        <p className="text-sm text-indigo-700 leading-relaxed">
          {roleInstructions[user?.role] ||
            "Your role defines the permissions and capabilities available to you within the Examora platform."}
        </p>

      </div>

      {/* Helpful Tips */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Account Tips
        </h2>

        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>Keep your profile information accurate to ensure proper account identification.</li>
          <li>Your email address is used for authentication and cannot be modified.</li>
          <li>System activity such as login history is monitored for security purposes.</li>
          <li>If you notice any unusual activity, contact the system administrator immediately.</li>
        </ul>

      </div>

    </div>
  );
};

export default ProfilePage;