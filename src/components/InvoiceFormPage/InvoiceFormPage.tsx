"use client"; // Add this line at the top

import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { toast } from "react-toastify";

const InvoiceFormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carNumber: "",
    carType: "",
    services: {
      wash: false,
      polish: false,
      vacuum: false,
      engineCleaning: false,
      tireCleaning: false,
      waxing: false,
      interiorCleaning: false,
      exteriorCleaning: false,
    },
    discount: 0,
  });

  const [isInvoiceVisible, setInvoiceVisible] = useState(false); // For showing invoice preview
  const [currentDate, setCurrentDate] = useState<string>(""); // For current date
  const [invoiceData, setInvoiceData] = useState<any>(null); // For storing invoice data for printing

  const carTypes = ["Sedan", "SUV", "Truck", "Hatchback"];

  // Define service prices for different car types
  const servicePrices = {
    Sedan: {
      wash: 10,
      polish: 20,
      vacuum: 15,
      engineCleaning: 25,
      tireCleaning: 10,
      waxing: 30,
      interiorCleaning: 20,
      exteriorCleaning: 25,
    },
    SUV: {
      wash: 12,
      polish: 22,
      vacuum: 17,
      engineCleaning: 27,
      tireCleaning: 12,
      waxing: 32,
      interiorCleaning: 22,
      exteriorCleaning: 27,
    },
    Truck: {
      wash: 15,
      polish: 25,
      vacuum: 18,
      engineCleaning: 30,
      tireCleaning: 15,
      waxing: 35,
      interiorCleaning: 25,
      exteriorCleaning: 30,
    },
    Hatchback: {
      wash: 8,
      polish: 18,
      vacuum: 12,
      engineCleaning: 20,
      tireCleaning: 8,
      waxing: 28,
      interiorCleaning: 18,
      exteriorCleaning: 20,
    },
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement; // Type assertion for the event target
    const checked = (e.target as HTMLInputElement).checked; // Explicitly assert as HTMLInputElement for checked property

    if (name.startsWith("services")) {
      const serviceName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          [serviceName]: checked,
        },
      }));
    } else {
      // Handle number type and empty string case
      const newValue =
        type === "number" && value === ""
          ? 0
          : type === "number"
            ? Number(value)
            : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // Calculate total price for selected services based on car type
  const calculateTotal = () => {
    let total = 0;
    const selectedCarType = formData.carType;
    const pricesForSelectedCarType =
      servicePrices[selectedCarType as keyof typeof servicePrices];

    if (!selectedCarType || !pricesForSelectedCarType) return total; // If no car type is selected

    Object.keys(formData.services).forEach((service) => {
      if (formData.services[service as keyof typeof formData.services]) {
        total +=
          pricesForSelectedCarType[
            service as keyof typeof pricesForSelectedCarType
          ];
      }
    });

    return total - formData.discount;
  };

  // Handle form submission (submit invoice to backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data to send to the server
    const newInvoiceData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      carNumber: formData.carNumber,
      carType: formData.carType,
      services: Object.keys(formData.services).filter(
        (service) =>
          formData.services[service as keyof typeof formData.services],
      ),
      total: calculateTotal(),
      date: currentDate,
    };

    try {
      // Send POST request to your API
      const response = await axios.post("/api/invoices", newInvoiceData);
      console.log("Invoice created with ID:", response.data.id);

      // Store invoice data for printing
      setInvoiceData(newInvoiceData);
      setInvoiceVisible(true);

      // Show toast notification for success
      toast.success("Invoice added successfully!");

      // Clear the form fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        carNumber: "",
        carType: "",
        services: {
          wash: false,
          polish: false,
          vacuum: false,
          engineCleaning: false,
          tireCleaning: false,
          waxing: false,
          interiorCleaning: false,
          exteriorCleaning: false,
        },
        discount: 0,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to add invoice.");
    }
  };

  // Print the invoice
  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=800");

    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Invoice</title>");
      printWindow.document.write("</head><body>");
      printWindow.document.write(`
        <h3>Invoice</h3>
        <p><strong>Name:</strong> ${invoiceData?.name}</p>
        <p><strong>Email:</strong> ${invoiceData?.email}</p>
        <p><strong>Phone No:</strong> ${invoiceData?.phone}</p>
        <p><strong>Car No:</strong> ${invoiceData?.carNumber}</p>
        <p><strong>Car Type:</strong> ${invoiceData?.carType}</p>
        <p><strong>Services:</strong> ${invoiceData?.services.join(", ")}</p>
        <p><strong>Total:</strong> $${invoiceData?.total.toFixed(2)}</p>
        <p><strong>Date:</strong> ${currentDate}</p>
      `);
      printWindow.document.write("</body></html>");
      printWindow.document.close(); // Close the document for writing
      printWindow.print(); // Print the window

      // Hide the print button after printing
      setInvoiceVisible(false);
    } else {
      console.error("Failed to open print window.");
    }
  };

  // Set the current date when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl rounded-md bg-white p-4 text-gray-900 shadow-md dark:bg-[#122031] dark:text-white">
        <Breadcrumb pageName="Car Wash Invoice" />
        <h2 className="mb-4 text-2xl font-bold">Car Wash Invoice Form</h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name, Email, Phone Row */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
                required
              />
            </div>
            <div>
              <label className="mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
                required
              />
            </div>
            <div>
              <label className="mb-1 block">Phone No</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
                required
              />
            </div>
          </div>

          {/* Car Number and Car Type */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block">Car No</label>
              <input
                type="text"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
                required
              />
            </div>
            <div>
              <label className="mb-1 block">Car Type</label>
              <select
                name="carType"
                value={formData.carType}
                onChange={handleChange}
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
                required
              >
                <option value="">Select Car Type</option>
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services with Checkboxes */}
          <h3 className="mb-2 text-xl font-bold">Services</h3>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            {Object.keys(formData.services).map((service) => {
              const carType = formData.carType as keyof typeof servicePrices; // Assert carType to match the keys of servicePrices

              return (
                <div key={service}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name={`services.${service}`}
                      checked={
                        formData.services[
                          service as keyof typeof formData.services
                        ]
                      }
                      onChange={handleChange}
                      className="dark:bg-light-blue-100 h-5 w-5 rounded border dark:text-black"
                    />
                    <span className="ml-2">
                      {service.charAt(0).toUpperCase() + service.slice(1)} ( $
                      {formData.carType &&
                      servicePrices[carType] &&
                      servicePrices[carType][
                        service as keyof typeof servicePrices.Sedan
                      ]
                        ? servicePrices[carType][
                            service as keyof typeof servicePrices.Sedan
                          ]
                        : 0}
                      )
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {/* Discount and Total */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block">Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
              />
            </div>
            <div>
              <label className="mb-1 block">Total</label>
              <input
                type="text"
                value={`$${calculateTotal().toFixed(2)}`}
                disabled
                className="dark:bg-light-blue-100 w-full rounded border px-4 py-2 dark:text-black"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Invoice
          </button>

          {/* Print Invoice Button */}
          {isInvoiceVisible && (
            <button
              type="button"
              onClick={handlePrint}
              className="ml-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Print Invoice
            </button>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default InvoiceFormPage;
