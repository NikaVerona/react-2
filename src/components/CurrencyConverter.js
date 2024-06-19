import React, { useState } from "react";
import "./styles.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [result, setResult] = useState("Amount in PLN: -");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setResult("Amount in PLN: -");
    setErrorMessage("");

    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a correct amount.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`
      );
      const data = await response.json();
      const rate = data.rates[0].mid;
      const conversionResult = (amount * rate).toFixed(2);

      setResult(`Amount in PLN: ${conversionResult}`);
    } catch (error) {
      setErrorMessage("Error while receiving data. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <img src="logo.webp" alt="Logo" className="logo" />
      <div className="converter">
        <h1>Currency Converter</h1>
        <form id="converter-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            className="form-element"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            name="currency"
            className="form-element"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">USA dollars (USD)</option>
            <option value="CHF">Swiss francs (CHF)</option>
          </select>
          <button type="submit" className="form-element">
            Convert
          </button>
        </form>
        <div id="result">{result}</div>
        {errorMessage && (
          <div id="error-message" className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
