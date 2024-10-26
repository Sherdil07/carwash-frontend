"use client";
import { useState, useEffect } from "react";

interface InvoiceData {
  id: number; // Add an ID field for identifying records
  name: string;
  email: string;
  phone: string;
  carNumber: string;
  carType: string;
  services: string[]; // Ensure this is always an array
  total: number;
  date: string;
}

interface TableOneProps {
  addInvoice: (data: InvoiceData) => void; // Accepting a function prop
}

const TableOne: React.FC<TableOneProps> = ({ addInvoice }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filtered invoices based on search term
  const filteredInvoices = invoiceData.filter((invoice) =>
    invoice.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  // Get the current invoices for the current page
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // Effect to listen for new invoices added from parent
  useEffect(() => {
    const fetchInvoices = async () => {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      setInvoiceData(data);
    };
    fetchInvoices();
  }, []);

  // Function to handle new invoice addition
  const handleAddInvoice = (newInvoice: InvoiceData) => {
    setInvoiceData((prev) => [...prev, newInvoice]);
    addInvoice(newInvoice); // Notify parent component about the new invoice
  };

  // Function to handle deletion of an invoice
  const handleDeleteInvoice = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );
    if (confirmed) {
      try {
        const response = await fetch(
          `http://localhost:4000/api/invoices/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setInvoiceData((prev) => prev.filter((invoice) => invoice.id !== id));
        } else {
          alert("Failed to delete the invoice");
        }
      } catch (error) {
        alert("Error deleting the invoice");
      }
    }
  };

  // Function to handle updating an invoice
  const handleUpdateInvoice = (index: number) => {
    // You can implement a modal or a new page for updating the invoice
    const updatedInvoice = prompt("Enter new invoice details (JSON format):");
    if (updatedInvoice) {
      try {
        const parsedInvoice: InvoiceData = JSON.parse(updatedInvoice);
        const updatedInvoices = [...invoiceData];
        updatedInvoices[index] = parsedInvoice; // Update the specific invoice
        setInvoiceData(updatedInvoices);
      } catch (error) {
        alert("Invalid input. Please enter valid JSON.");
      }
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Invoices
      </h4>

      {/* Search Bar */}
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
        <div className="grid grid-cols-6">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase">Name</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase">Car No</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase">Services</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase">Total</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase">Date</h5>
          </div>
          <div className="px-2 pb-3.5 text-center">
            <h5 className="text-sm font-medium uppercase">Actions</h5>
          </div>
        </div>

        {currentInvoices.map((invoice, index) => (
          <div
            className={`grid grid-cols-6 ${
              index === currentInvoices.length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
            }`}
            key={invoice.id} // Use the unique ID as the key
          >
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.name}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.carNumber}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {Array.isArray(invoice.services)
                  ? invoice.services.join(", ")
                  : "No services"}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                ${invoice.total.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <p className="font-medium text-dark dark:text-white">
                {invoice.date}
              </p>
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <button
                onClick={() => handleUpdateInvoice(index)}
                className="mr-2 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteInvoice(invoice.id)} // Pass the ID for deletion
                className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableOne;
