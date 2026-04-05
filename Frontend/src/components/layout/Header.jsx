export default function Header() {
  const role = localStorage.getItem("role");

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between">
      <h2 className="font-semibold">Dashboard</h2>

      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded">
        {role}
      </span>
    </div>
  );
}