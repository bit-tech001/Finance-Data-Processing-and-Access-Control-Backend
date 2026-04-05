export default function TransactionsTable({ data }) {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm w-full">
      <h3 className="mb-4 font-semibold">Recent Transactions</h3>

      {data.map((r) => (
        <div
          key={r._id}
          className="flex justify-between p-2 hover:bg-gray-50 rounded"
        >
          <span>{r.category}</span>

          <span
            className={
              r.type === "income" ? "text-green-500" : "text-red-500"
            }
          >
            ₹{r.amount}
          </span>
        </div>
      ))}
    </div>
  );
}