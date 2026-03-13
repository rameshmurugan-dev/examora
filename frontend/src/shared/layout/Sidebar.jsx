import { NavLink } from 'react-router-dom';

const Sidebar = ({ items, open, onLogout }) => {
  return (
    <aside
      className={`
        fixed top-16 left-0
        h-[calc(100vh-4rem)]
        w-64
        bg-slate-900
        border-r border-slate-800
        text-slate-300
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-4 space-y-1">

          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-all
                duration-150
                group
                ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }
                `
              }
            >
              {/* ICON */}
              <span
                className="
                  flex items-center justify-center
                  w-5 h-5
                  text-slate-400
                  group-hover:text-white
                "
              >
                {item.icon}
              </span>

              {/* LABEL */}
              <span>{item.label}</span>
            </NavLink>
          ))}

        </nav>

        {/* FOOTER / LOGOUT */}
        {onLogout && (
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={onLogout}
              className="
                w-full
                flex items-center justify-center gap-2
                px-4 py-2.5
                rounded-lg
                text-sm font-medium
                text-red-400
                hover:bg-red-500/10
                hover:text-red-300
                transition
              "
            >
              Sign Out
            </button>
          </div>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;