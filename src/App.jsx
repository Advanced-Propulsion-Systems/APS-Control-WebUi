import { useState, useEffect, useRef } from "react";
import "chart.js/auto";
import { Scatter } from "react-chartjs-2";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Button } from "./components/common";

const relayCount = 4;

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
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(
    wsProtocol + apiURL.host + "/ws",
    {
      retryOnError: true,
      shouldReconnect: () => true,
    },
  );
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
        const minValue = msg.data.time - 5;
        const maxValue = msg.data.time;

        setDatasets((datasets) => {
          return {
            ...datasets,
            [msg.data.id]: {
              ...datasets[msg.data.id],
              data: [
                ...datasets[msg.data.id].data.slice(
                  datasets[msg.data.id].data.findIndex(
                    (datum) => datum.x >= minValue,
                  ),
                ),
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
                min: minValue,
                max: maxValue,
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
      sendJsonMessage({ cmd: "stop-recording" });
    } else {
      sendJsonMessage({
        cmd: "start-recording",
        name: filenameInputRef.current.value,
      });
    }
    setRecording(!recording);
  };

  const relayButtons = [];
  for (let i = 0; i < relayCount; i++) {
    relayButtons.push(
      <div key={i}>
        <Button
          className="btn btn-warning"
          onClick={() =>
            sendJsonMessage({ cmd: "toggle-relay", id: i, state: true })
          }
        >
          ON
        </Button>
        <Button
          className="btn-error"
          onClick={() =>
            sendJsonMessage({ cmd: "toggle-relay", id: i, state: false })
          }
        >
          OFF
        </Button>
      </div>,
    );
  }

  return (
    <>
      <Scatter
        data={{ datasets: Object.values(datasets) }}
        options={chartOptions}
      />
      <aside>
        <Button>Limpiar</Button>
        <label>
          Nombre de archivo:
          <input type="text" ref={filenameInputRef} disabled={recording} />
        </label>
        <Button onClick={handleRecordClick}>
          {recording ? "Parar grabación" : "Grabar"}
        </Button>
        <div>
          <Button>Ignite</Button>
          <Button>Parar Motor</Button>
        </div>
        {relayButtons.map((button) => button)}
      </aside>
    </>
  );
}

export default App;
