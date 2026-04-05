import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function Records() {
  const [records, setRecords] = useState([]);
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "income"
  });

  const load = () => {
    API.get("/records").then(res => setRecords(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await API.post("/records", form);
    load();
  };

  return (
    <Layout>
      <h2 className="text-lg font-semibold mb-4">Records</h2>

      {role === "admin" && (
        <div className="bg-white p-4 rounded border mb-4">
          <input className="border p-2 mr-2" placeholder="Amount"
            onChange={e => setForm({...form, amount: e.target.value})}/>
          <input className="border p-2 mr-2" placeholder="Category"
            onChange={e => setForm({...form, category: e.target.value})}/>
          <select className="border p-2 mr-2"
            onChange={e => setForm({...form, type: e.target.value})}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={add}>
            Add
          </button>
        </div>
      )}

      {records.map(r => (
        <div key={r._id} className="bg-white p-3 rounded border mb-2 flex justify-between">
          <span>{r.category}</span>
          <span>₹{r.amount}</span>
        </div>
      ))}
    </Layout>
  );
}