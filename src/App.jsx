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
  const filenameInputRef = useRef();
	const [recording, setRecording] = useState(false);
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(wsProtocol + apiURL.host + "/ws", {
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
    switch (msg.type) {
      case "setup":
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

const handleRecordClick = () => {
	if (recording) {
		sendJsonMessage({cmd: "stop-recording"})
	} else {
		sendJsonMessage({cmd: "start-recording", name: filenameInputRef.current.value})
	}
	setRecording(!recording)
}

  return (
    <>
      <Scatter
        data={{ datasets: Object.values(datasets) }}
        options={chartOptions}
      />
	  <aside>
	  <button>Limpiar</button>
          <label
            >Nombre de archivo:
            <input type="text" ref={filenameInputRef} disabled={recording} />
          </label>
          <button onClick={handleRecordClick}>{recording ? "Parar grabación" : "Grabar"}</button>
	  <div>
	  	<button>Ignite</button>
	  	<button>Parar Motor</button>
	  </div>
	  </aside>
    </>
  );
}

export default App;
