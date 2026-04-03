import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Transactions", path: "/transactions" },
    { name: "Insights", path: "/insights" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Zorvyn Finance</h1>

      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded transition ${
                isActive
                  ? "bg-indigo-600"
                  : "hover:bg-gray-700"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;