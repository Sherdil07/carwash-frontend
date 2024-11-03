"use client";
import { useState, useEffect } from "react";
import axios from "axios";

//CSV CODE

interface InvoiceData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  carNumber: string;
  carType: string;
  services: string[];
  total: number;
  date: string;
}

interface TableOneProps {
  addInvoice: (data: InvoiceData) => void;
}

const TableOne: React.FC<TableOneProps> = ({ addInvoice }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          "https://carwash-backend-eight.vercel.app/api/invoices",
        );
        setInvoiceData(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleAddInvoice = async (newInvoice: InvoiceData) => {
    try {
      const response = await axios.post(
        "https://carwash-backend-eight.vercel.app/api/invoices",
        newInvoice,
      );
      setInvoiceData((prev) => [...prev, response.data]);
      addInvoice(response.data);
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );
    if (confirmed) {
      try {
        await axios.delete(
          `https://carwash-backend-eight.vercel.app/api/invoices/${id}`,
        );
        setInvoiceData((prev) => prev.filter((invoice) => invoice._id !== id));
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleUpdateInvoice = async (id: string) => {
    const updatedDetails = prompt(
      "Enter updated invoice details (JSON format):",
    );
    if (updatedDetails) {
      try {
        const parsedInvoice: Partial<InvoiceData> = JSON.parse(updatedDetails);
        const response = await axios.put(
          `https://carwash-backend-eight.vercel.app/api/invoices/${id}`,
          parsedInvoice,
        );
        setInvoiceData((prev) =>
          prev.map((invoice) => (invoice._id === id ? response.data : invoice)),
        );
      } catch (error) {
        console.error("Error updating invoice:", error);
      }
    }
  };
  // csv code
  const exportToCSV = () => {
    const csvRows = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Car Number",
        "Car Type",
        "Services",
        "Total",
        "Date",
      ], // Header row
      ...invoiceData.map((invoice) => [
        invoice._id,
        invoice.name,
        invoice.email,
        invoice.phone,
        invoice.carNumber,
        invoice.carType,
        invoice.services.join(", "),
        invoice.total.toFixed(2),
        invoice.date,
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredInvoices = invoiceData.filter((invoice) =>
    invoice.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="bg-dark-blue rounded-lg px-6 pb-6 pt-4 text-white shadow-lg">
      <h4 className="mb-5 text-xl font-bold">Invoices</h4>

      <div className="mb-4 flex justify-end">
        <button
          onClick={exportToCSV}
          className="mr-2 rounded bg-green-500 px-4 py-2 text-white"
        >
          Export CSV
        </button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded border px-4 py-2 text-black"
        />
      </div>

      <div className="flex flex-col space-y-4">
        {currentInvoices.map((invoice) => (
          <div
            className="border-b border-gray-400 p-4 md:grid md:grid-cols-6 md:gap-4 md:text-center md:text-sm"
            key={invoice._id}
          >
            {/* Display each row as a card on mobile */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <span className="font-semibold md:hidden">Name: </span>
              <span>{invoice.name}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <span className="font-semibold md:hidden">Car Number: </span>
              <span>{invoice.carNumber}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <span className="font-semibold md:hidden">Services: </span>
              <span>{invoice.services.join(", ")}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <span className="font-semibold md:hidden">Total: </span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <span className="font-semibold md:hidden">Date: </span>
              <span>{invoice.date}</span>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleUpdateInvoice(invoice._id)}
                className="rounded bg-yellow-500 px-2 py-1 text-white"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteInvoice(invoice._id)}
                className="rounded bg-red-500 px-2 py-1 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableOne;
