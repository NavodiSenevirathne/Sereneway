import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiCreditCard,
  FiPackage,
  FiDollarSign,
  FiSend,
} from "react-icons/fi";

const productsData = [
  { productId: "p1", name: "Package 1", price: 500 },
  { productId: "p2", name: "Package 2", price: 1200 },
  { productId: "p3", name: "Package 3", price: 150 },
];

const UpdatePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardHolderName: "",
    cardNumber: "",
    totalAmount: 0,
    isTotalEdited: false,
  });

  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payments/${id}`);
        const payment = res.data;

        setFormData({
          cardHolderName: payment.card.cardHolderName,
          cardNumber: `**** **** **** ${payment.card.cardNumber.slice(-4)}`,
          totalAmount: payment.totalAmount,
          isTotalEdited: false,
        });

        const formattedProducts = payment.products.map((p) => ({
          id: Date.now().toString() + Math.random().toString(),
          selectedProductId: p.productId,
          quantity: p.quantity.toString(),
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Failed to load payment", err);
      }
    };
    fetchPayment();
  }, [id]);

  const calculateTotalAmount = useCallback(() => {
    return products.reduce((sum, item) => {
      const product = productsData.find(
        (p) => p.productId === item.selectedProductId
      );
      const qty = parseInt(item.quantity || "0");
      return sum + (product ? product.price * qty : 0);
    }, 0);
  }, [products]);

  useEffect(() => {
    if (!formData.isTotalEdited) {
      setFormData((prev) => ({ ...prev, totalAmount: calculateTotalAmount() }));
    }
  }, [products, formData.isTotalEdited, calculateTotalAmount]);

  const validate = useCallback(() => {
    const errs = {};

    products.forEach((item) => {
      if (!item.selectedProductId)
        errs[`product_${item.id}`] = "Select a product";
      if (!/^\d+$/.test(item.quantity) || parseInt(item.quantity) < 1)
        errs[`quantity_${item.id}`] = "Enter valid quantity";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [products]);

  const handleProductChange = useCallback((id, field, value) => {
    if (formData.isTotalEdited) return; // prevent change if total is manually set
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }, [formData.isTotalEdited]);

  const handleTotalChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFormData((prev) => ({ ...prev, totalAmount: value, isTotalEdited: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formattedProducts = products.map((item) => {
        const product = productsData.find(
          (p) => p.productId === item.selectedProductId
        );
        return {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: parseInt(item.quantity),
        };
      });

      await axios.put(`http://localhost:5000/api/payments/${id}`, {
        products: formattedProducts,
        totalAmount: formData.totalAmount,
      });

      alert("Payment updated successfully!");
      navigate("/manage-payments");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update payment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Update Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center border border-gray-300 rounded p-2 bg-gray-100">
              <span className="text-gray-500 mr-2"><FiUser /></span>
              <input
                className="w-full outline-none bg-gray-100 cursor-not-allowed"
                value={formData.cardHolderName}
                disabled
              />
            </div>
          </div>
          <div>
            <div className="flex items-center border border-gray-300 rounded p-2 bg-gray-100">
              <span className="text-gray-500 mr-2"><FiCreditCard /></span>
              <input
                className="w-full outline-none bg-gray-100 cursor-not-allowed"
                value={formData.cardNumber}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {products.map((item) => (
            <div key={item.id} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 rounded p-2">
                  <span className="text-gray-500 mr-2"><FiPackage /></span>
                  <select
                    className="w-full outline-none"
                    value={item.selectedProductId}
                    onChange={(e) => handleProductChange(item.id, "selectedProductId", e.target.value)}
                  >
                    <option value="">Select Product</option>
                    {productsData.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name} (${product.price})
                      </option>
                    ))}
                  </select>
                </div>
                {errors[`product_${item.id}`] && <p className="text-red-500 text-sm">{errors[`product_${item.id}`]}</p>}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 rounded p-2">
                  <span className="text-gray-500 mr-2"><FiPackage /></span>
                  <input
                    type="number"
                    min="1"
                    className="w-full outline-none"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(item.id, "quantity", e.target.value)}
                    disabled={formData.isTotalEdited}
                  />
                </div>
                {errors[`quantity_${item.id}`] && <p className="text-red-500 text-sm">{errors[`quantity_${item.id}`]}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center text-xl font-semibold mt-4">
          <FiDollarSign className="mr-2" />
          <input
            type="number"
            className="border border-gray-300 rounded px-2 py-1 w-32 text-right"
            value={formData.totalAmount}
            onChange={handleTotalChange}
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          <FiSend /> Update Payment
        </button>
      </form>
    </div>
  );
};

export default UpdatePayment;