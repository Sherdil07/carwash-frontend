"use client";
import { useState } from "react";

const initialPrices = {
  carWash: 20.0,
  waxing: 30.0,
  detailing: 50.0,
};

const SettingsForm = () => {
  const [prices, setPrices] = useState(initialPrices);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPrices((prevPrices) => ({
      ...prevPrices,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically make an API call to save the new prices
    console.log("Updated Prices:", prices);
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Update Service Prices
      </h4>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex justify-between">
          <label
            htmlFor="carWash"
            className="font-medium text-dark dark:text-white"
          >
            Car Wash ($):
          </label>
          <input
            type="number"
            name="carWash"
            id="carWash"
            value={prices.carWash}
            onChange={handleChange}
            className="rounded border px-4 py-2"
            step="0.01"
          />
        </div>

        <div className="flex justify-between">
          <label
            htmlFor="waxing"
            className="font-medium text-dark dark:text-white"
          >
            Waxing ($):
          </label>
          <input
            type="number"
            name="waxing"
            id="waxing"
            value={prices.waxing}
            onChange={handleChange}
            className="rounded border px-4 py-2"
            step="0.01"
          />
        </div>

        <div className="flex justify-between">
          <label
            htmlFor="detailing"
            className="font-medium text-dark dark:text-white"
          >
            Detailing ($):
          </label>
          <input
            type="number"
            name="detailing"
            id="detailing"
            value={prices.detailing}
            onChange={handleChange}
            className="rounded border px-4 py-2"
            step="0.01"
          />
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsForm;
