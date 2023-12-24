import { useState, useEffect, useRef } from "react";
import "chart.js/auto";
import { Scatter } from "react-chartjs-2";
import useWebSocket, { ReadyState } from "react-use-websocket";

const apiURL = new URL(import.meta.env.VITE_API_URL);
let wsProtocol;
if (apiURL.protocol === "https:") {
  wsProtocol = "wss://";
} else {
  wsProtocol = "ws://";
}

function App() {
  const sensorsChartRef = useRef();
  const { lastJsonMessage } = useWebSocket(wsProtocol + apiURL.host + "/ws", {
    retryOnError: true,
    shouldReconnect: () => true,
  });
  const [datasets, setDatasets] = useState({
    old: {
      label: "# of Votes",
      data: [{ x: 1, y: 2 }],
      borderWidth: 1,
    },
  });
  const [chartOptions, setChartOptions] = useState({
    animation: false,
    showLine: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  });

  useEffect(() => {
    if (lastJsonMessage === null) {
      return;
    }

    console.log(lastJsonMessage);
    const msg = lastJsonMessage;
    const sensorsChart = sensorsChartRef.current;
    switch (msg.type) {
      case "setup":
        sensorsChart.data.datasets.length = 0;
        setDatasets({});
        msg.sensors.forEach((sensor) => {
          setDatasets((datasets) => {
            return { ...datasets, [sensor.id]: { label: sensor.id, data: [] } };
          });
        });
        break;

      case "data":
        setDatasets((datasets) => {
          return {
            ...datasets,
            [msg.data.id]: {
              ...datasets[msg.data.id],
              data: [
                ...datasets[msg.data.id].data,
                {
                  x: msg.data.time,
                  y: msg.data.value,
                },
              ],
            },
          };
        });

        setChartOptions((chartOptions) => {
          return {
            ...chartOptions,
            scales: {
              ...chartOptions.scales,
              x: {
                min: msg.data.time - 5,
                max: msg.data.time,
              },
            },
          };
        });
        break;

      default:
        console.log("Unknown msg type", msg);
    }
  }, [lastJsonMessage]);

  return (
    <>
      <Scatter
        ref={sensorsChartRef}
        data={{ datasets: Object.values(datasets) }}
        options={chartOptions}
      />
    </>
  );
}

export default App;
