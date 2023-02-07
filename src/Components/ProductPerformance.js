import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import React from "react";

export const options = {
  chart: {
    Date: "",
    Amount: "",
  },
};

export function ProductPerformance({ data }) {
  let graphData = []
  if (data && data.length > 0) {
    data.forEach(obj => {
      let objElement = {
        "total": obj.date,
        "Selling": obj.total
      }
      graphData.push(objElement);
    })
  }

  return (
    data && data.length === 0 ? <div style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center", color: 'red' }}> There is no data available during your selected duration !!! </div> :
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={800}
          height={300}
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="total" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Selling" fill="gray" />
          {/* <Bar dataKey="Reject" fill="red" /> */}
        </BarChart>
      </ResponsiveContainer>

  );
}
export default ProductPerformance;
