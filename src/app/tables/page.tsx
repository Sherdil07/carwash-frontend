"use client";

import { useState } from "react"; // Import useState
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

// Define the structure of the invoice data
export interface InvoiceData {
  name: string;
  email: string;
  phone: string;
  carNumber: string;
  carType: string;
  services: string[];
  total: number;
  date: string;
}

const TablesPage = () => {
  // State to hold invoices
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  // Function to add a new invoice to the state
  const addInvoice = (newInvoice: InvoiceData) => {
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        {/* Pass the addInvoice function to TableOne */}
        <TableOne addInvoice={addInvoice} />
        {/* Uncomment below if you want to include additional tables */}
        {/* <TableTwo />
        <TableThree /> */}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
