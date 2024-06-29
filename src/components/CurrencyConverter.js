import React, { useState } from "react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [result, setResult] = useState("Amount in PLN: -");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { value } = e.target;
    const validAmountPattern = /^\d*([.,]?\d{0,2})?$/;

    if (validAmountPattern.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setResult("Amount in PLN: -");
    setErrorMessage("");

    const myAmount = parseFloat(amount.replace(",", "."));

    if (!myAmount || myAmount <= 0) {
      setErrorMessage("Please enter a correct amount.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`
      );
      const data = await response.json();
      const rate = data.rates[0].mid;
      let conversionResult = (myAmount * rate).toFixed(2);

      if (amount.indexOf(',') > 0) { conversionResult = conversionResult.replace(".", ",") }

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
        <form  onSubmit={handleSubmit}>
          <input
            type="text"
            name="amount"
            className="form-element"
            placeholder="Enter amount"
            value={amount}
            onInput={handleInputChange}
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
        <div className="result">{result}</div>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
