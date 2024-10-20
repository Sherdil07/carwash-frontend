"use client";
import React, { useState } from "react";

import TableOne from "../Tables/TableOne";

import DataStatsOne from "@/components/DataStats/DataStatsOne";

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


const ECommerce: React.FC = () => {

  
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  // Function to add a new invoice to the state
  const addInvoice = (newInvoice: InvoiceData) => {
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
  };
  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* <ChartOne />
        <ChartTwo />
        <ChartThree /> */}
        {/* <MapOne /> */}

        <div className="col-span-12 xl:col-span-12">
          <TableOne addInvoice={addInvoice} />
        </div>
        {/* <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;
