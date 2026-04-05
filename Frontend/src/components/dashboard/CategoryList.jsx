export default function CategoryList({ categories }) {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm w-1/3">
      <h3 className="mb-4 font-semibold">Categories</h3>

      {Object.entries(categories || {}).map(([key, val]) => (
        <div key={key} className="flex justify-between mb-2">
          <span>{key}</span>
          <span>₹{val}</span>
        </div>
      ))}
    </div>
  );
}