"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface InvoiceData {
  _id: string; // Use MongoDB _id for uniqueness
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

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api/invoices");
        setInvoiceData(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  // Add new invoice
  const handleAddInvoice = async (newInvoice: InvoiceData) => {
    try {
      const response = await axios.post("/api/invoices", newInvoice);
      setInvoiceData((prev) => [...prev, response.data]);
      addInvoice(response.data);
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  // Delete an invoice
  const handleDeleteInvoice = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );
    if (confirmed) {
      try {
        await axios.delete(`/api/invoices/${id}`);
        setInvoiceData((prev) => prev.filter((invoice) => invoice._id !== id));
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  // Update an invoice
  const handleUpdateInvoice = async (id: string) => {
    const updatedDetails = prompt(
      "Enter updated invoice details (JSON format):",
    );
    if (updatedDetails) {
      try {
        const parsedInvoice: Partial<InvoiceData> = JSON.parse(updatedDetails);
        const response = await axios.put(`/api/invoices/${id}`, parsedInvoice);
        setInvoiceData((prev) =>
          prev.map((invoice) => (invoice._id === id ? response.data : invoice)),
        );
      } catch (error) {
        console.error("Error updating invoice:", error);
      }
    }
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
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark">Invoices</h4>

      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded border px-4 py-2"
        />
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-6">{/* Table headers */}</div>

        {currentInvoices.map((invoice) => (
          <div className="grid grid-cols-6" key={invoice._id}>
            <div className="flex items-center px-2 py-4">
              <p>{invoice.name}</p>
            </div>
            <div className="flex items-center px-2 py-4">
              <p>{invoice.carNumber}</p>
            </div>
            <div className="flex items-center px-2 py-4">
              <p>{invoice.services.join(", ")}</p>
            </div>
            <div className="flex items-center px-2 py-4">
              <p>${invoice.total.toFixed(2)}</p>
            </div>
            <div className="flex items-center px-2 py-4">
              <p>{invoice.date}</p>
            </div>
            <div className="flex items-center px-2 py-4">
              <button
                onClick={() => handleUpdateInvoice(invoice._id)}
                className="mr-2 bg-yellow-500 px-2 py-1 text-white"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteInvoice(invoice._id)}
                className="bg-red-500 px-2 py-1 text-white"
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
          className="bg-blue-500 px-4 py-2 text-white"
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
          className="bg-blue-500 px-4 py-2 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableOne;
