import { useState } from "react";
import "chart.js/auto";
import { Scatter } from "react-chartjs-2";

function App() {
  return (
    <>
      <Scatter
        data={{
          datasets: [
            {
              label: "# of Votes",
              data: [{ x: 1, y: 2 }],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          animation: false,
          showLine: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </>
  );
}

export default App;
