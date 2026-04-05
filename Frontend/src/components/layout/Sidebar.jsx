import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-56 h-screen bg-slate-900 text-white p-5">
      <h2 className="text-xl font-semibold mb-6">Finance</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/records">Records</Link>
      </nav>
    </div>
  );
}