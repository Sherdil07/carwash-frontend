import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartThree: React.FC = () => {
  // Define series data for Colorado City bookings
  const series = [10, 18, 6, 15, 17, 19, 41, 6, 15, 14, 81, 71, 90, 30, 50, 62, 41, 57, 50, 60, 40, 70, 80, 50]; // Example percentages for cities
  const labels = [
    "Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder", "Greeley", "Arvada", "Thornton",
    "Lakewood", "Pueblo", "Englewood", "Littleton", "Broomfield", "Westminster", "Grand Junction",
    "Castle Rock", "Longmont", "Commerce City", "Parker", "Highlands Ranch", "Sterling", "Centennial",
    "Wheat Ridge", "Lafayette"
  ];
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#E67E22", "#2ECC71", "#3498DB", "#9B59B6",
    "#F39C12", "#E74C3C", "#1ABC9C", "#34495E", "#7F8C8D", "#BDC3C7", "#C0392B", "#16A085",
    "#27AE60", "#2980B9", "#8E44AD", "#F39C12", "#D35400", "#C0C0C0", "#7D3F3F", "#A93226"
  ];

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: colors,
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Bookings",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Colorado City Bookings
          </h4>
        </div>
        <div>
          <DefaultSelectOption options={["Monthly", "Yearly"]} />
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {labels.map((label, index) => (
            <div key={index} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span>{label}</span>
                  <span>{series[index]}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
