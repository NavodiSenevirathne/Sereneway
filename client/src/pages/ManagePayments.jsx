import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import autoTable from "jspdf-autotable";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/payments/${id}`);
      alert("Payment deleted successfully");
      fetchPayments(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete payment");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Payments Report", 14, 16);

    payments.forEach((p, i) => {
      autoTable(doc, {
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 22,
        head: [["#", "Card Holder", "Card Number", "Total", "Date"]],
        body: [
          [
            i + 1,
            p.card.cardHolderName,
            `**** **** **** ${p.card.cardNumber.slice(-4)}`,
            `$${p.totalAmount.toFixed(2)}`,
            new Date(p.createdAt).toLocaleDateString(),
          ],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        theme: "grid",
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 2,
        head: [["Product", "Quantity", "Unit Price", "Subtotal"]],
        body: p.products.map((prod) => [
          prod.name,
          prod.quantity,
          `$${prod.price}`,
          `$${(prod.price * prod.quantity).toFixed(2)}`,
        ]),
        styles: { fontSize: 9 },
        theme: "striped",
      });
    });

    doc.save("Payments_Report.pdf");
  };

  const filteredPayments = payments.filter((p) =>
    p.card.cardHolderName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Payments</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by card holder name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={generateReport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Card Holder</th>
              <th className="p-2 border">Card Number</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p, i) => (
              <React.Fragment key={p._id}>
                <tr className="border-t">
                  <td className="p-2 border text-center">{i + 1}</td>
                  <td className="p-2 border">{p.card.cardHolderName}</td>
                  <td className="p-2 border">
                    •••• •••• •••• {p.card.cardNumber.slice(-4)}
                  </td>
                  <td className="p-2 border">${p.totalAmount.toFixed(2)}</td>
                  <td className="p-2 border">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => navigate(`/updatePayment/${p._id}`)}
                      className="bg-blue-900 hover:bg-yellow-600 text-white px-4 py-1 rounded transition-colors duration-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {/* Product row */}
                <tr className="border-b bg-gray-50">
                  <td colSpan="6" className="p-2">
                    <strong>Products:</strong>
                    <ul className="ml-4 list-disc text-sm">
                      {p.products.map((prod, idx) => (
                        <li key={idx}>
                          {prod.name} — Qty: {prod.quantity}, Unit: $
                          {prod.price}, Subtotal: $
                          {(prod.quantity * prod.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </React.Fragment>
            ))}

            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayments;
