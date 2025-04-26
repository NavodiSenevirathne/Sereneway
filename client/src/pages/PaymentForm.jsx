import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  FiUser,
  FiCreditCard,
  FiCalendar,
  FiLock,
  FiPackage,
  FiDollarSign,
  FiSend,
} from "react-icons/fi";

// Predefined product list
const productsData = [
  { productId: "p1", name: "Tour Package 1", price: 500 },
  { productId: "p2", name: "Tour Package 2", price: 1200 },
  { productId: "p3", name: "Tour Package 3", price: 150 },
];

const generateProduct = () => ({
  id: Date.now().toString() + Math.random().toString(),
  selectedProductId: "",
  quantity: "",
});

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [products, setProducts] = useState([generateProduct()]);
  const [errors, setErrors] = useState({});

  const calculateTotalAmount = useCallback(() => {
    return products.reduce((sum, item) => {
      const product = productsData.find(
        (p) => p.productId === item.selectedProductId
      );
      const qty = parseInt(item.quantity || "0");
      return sum + (product ? product.price * qty : 0);
    }, 0);
  }, [products]);

  const validate = useCallback(() => {
    const errs = {};
    const { cardHolderName, cardNumber, expiryMonth, expiryYear, cvv } =
      formData;
    //  Validate Card Holder Name
    if (!cardHolderName.trim()) errs.cardHolderName = "Required";
  
    // Validate Card Number (Must be exactly 16 digits)
    if (!/^\d{16}$/.test(cardNumber)) errs.cardNumber = "Must be 16 digits";
    // Validate Expiry Month (Must be MM format and between 01-12)
    if (
      !/^\d{2}$/.test(expiryMonth) ||
      parseInt(expiryMonth) < 1 ||
      parseInt(expiryMonth) > 12
    )
      errs.expiryMonth = "Invalid month";
      //  Validate Expiry Year (Must be YYYY format)
    if (!/^\d{4}$/.test(expiryYear)) errs.expiryYear = "Invalid year";
    //  Validate CVV (Must be exactly 3 digits)
    if (!/^\d{3}$/.test(cvv)) errs.cvv = "CVV must be 3 digits";

    products.forEach((item, i) => {
      if (!item.selectedProductId)
        errs[`product_${item.id}`] = "Select a product";
      if (!/^\d+$/.test(item.quantity) || parseInt(item.quantity) < 1)
        errs[`quantity_${item.id}`] = "Enter valid quantity";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData, products]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProductChange = useCallback((id, field, value) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

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

      await axios.post("http://localhost:5000/api/payments", {
        card: formData,
        products: formattedProducts,
        totalAmount: calculateTotalAmount(),
      });

      alert("Payment Successful!");
    } catch (err) {
      console.error(err);
      alert("Payment Failed!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Make a Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            icon={<FiUser />}
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
            placeholder="Card Holder Name"
            error={errors.cardHolderName}
          />
          <InputField
            icon={<FiCreditCard />}
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="Card Number"
            error={errors.cardNumber}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <InputField
            icon={<FiCalendar />}
            name="expiryMonth"
            value={formData.expiryMonth}
            onChange={handleInputChange}
            placeholder="MM"
            error={errors.expiryMonth}
          />
          <InputField
            icon={<FiCalendar />}
            name="expiryYear"
            value={formData.expiryYear}
            onChange={handleInputChange}
            placeholder="YYYY"
            error={errors.expiryYear}
          />
          <InputField
            icon={<FiLock />}
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            placeholder="CVV"
            error={errors.cvv}
          />
        </div>

        {/* Product Inputs */}
        <div className="space-y-4">
          {products.map((item) => (
            <div key={item.id} className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 rounded p-2">
                  <span className="text-gray-500 mr-2"><FiPackage /></span>
                  <select
                    className="w-full outline-none"
                    value={item.selectedProductId}
                    onChange={(e) =>
                      handleProductChange(item.id, "selectedProductId", e.target.value)
                    }
                  >
                    <option value="">Select Package</option>
                    {productsData.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name} (${product.price})
                      </option>
                    ))}
                  </select>
                </div>
                {errors[`product_${item.id}`] && (
                  <p className="text-red-500 text-sm">{errors[`product_${item.id}`]}</p>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 rounded p-2">
                  <span className="text-gray-500 mr-2"><FiPackage /></span>
                  <input
                    type="number"
                    min="1"
                    className="w-full outline-none"
                    value={item.quantity}
                    onChange={(e) =>
                      handleProductChange(item.id, "quantity", e.target.value)
                    }
                  />
                </div>
                {errors[`quantity_${item.id}`] && (
                  <p className="text-red-500 text-sm">{errors[`quantity_${item.id}`]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-end items-center text-xl font-semibold mt-4">
          Total: <FiDollarSign className="ml-2 mr-1" /> {calculateTotalAmount().toFixed(2)}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          <FiSend /> Submit Payment
        </button>
      </form>
    </div>
  );
};

// ✅ Memoized Controlled Input Field
const InputField = React.memo(
  ({ icon, name, value, onChange, placeholder, error }) => (
    <div>
      <div className="flex items-center border border-gray-300 rounded p-2">
        <span className="text-gray-500 mr-2">{icon}</span>
        <input
          className="w-full outline-none"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);

export default PaymentForm;
