import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["City", "Total Products Reject", "Total Products Sale"],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 2099000, 1953000],
  ["Philadelphia, PA", 1526000, 1517000],
];

export const options = {
  // title: "Your Progress",
  chartArea: { width: "55%" },
  colors: ["#b0120a", "#ffab91"],
  hAxis: {
    title: "Total Products Sales",
    minValue: 0,
  },
  vAxis: {
    title: "City",
  },
};

export function ProgressChart() {
  return (
    <Chart
      chartType="BarChart"
      width="92%"
      height="450px"
      data={data}
      options={options}
    />
  );
}
export default ProgressChart;
