import '../Pages/Dashboard/styles.scss';

import { Chart } from "react-google-charts";
import React from "react";

export const options = {
  chart: {
    title: "",
    subtitle: "",
  },
};

export function EarningGraph({data}) {
  let graphData = []

  if (data && data.length > 0) {
    graphData.push(["Date", "Earning"]);
    data.forEach(obj => {
      const element = [obj.date, obj.totalAmount];
      graphData.push(element)
    })
  }

  return (
    data && data.length === 0 ? <div className='earningGraph'>
      There is no earning on your selected duration !!!
    </div> :
      <Chart
        chartType="AreaChart"
        width="100%"
        height="350px"
        data={graphData}
        options={options}
      />


  );
}
export default EarningGraph;
