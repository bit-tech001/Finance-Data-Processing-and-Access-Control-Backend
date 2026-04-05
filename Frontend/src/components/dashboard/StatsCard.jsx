export default function StatsCard({ title, value, type }) {
  const color =
    type === "income"
      ? "text-green-500"
      : type === "expense"
      ? "text-red-500"
      : "text-gray-800";

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>₹{value || 0}</h2>
    </div>
  );
}