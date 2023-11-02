import Chart from "chart.js/auto";

let recordingStatus = false;

window.onload = () => {
  const ctx = document.getElementById("sensorsChart");
  const sensorsChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "# of Votes",
          data: [{ x: 1, y: 2 }],
          borderWidth: 1,
        },
      ],
    },
    options: {
      showLine: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  const apiURL = new URL(process.env.API_URL);
  let wsProtocol;
  if (apiURL.protocol === "https:") {
    wsProtocol = "wss://";
  } else {
    wsProtocol = "ws://";
  }

  const socket = new WebSocket(wsProtocol + apiURL.host + "/ws");
  socket.addEventListener("message", async (event) => {
    console.log(event.data);
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case "setup":
        sensorsChart.data.datasets = msg.sensors.map((setup) => {
          return { label: setup.id };
        });
        sensorsChart.update();
        break;

      case "data":
        sensorsChart.data.datasets.forEach((dataset) => {
          dataset.data.push(msg.data[dataset.label]);
        });
        sensorsChart.update();
        break;

      default:
        console.log("Unknown msg type", event.data);
    }
  });

  const filenameInput = document.getElementById("filenameInput");
  console.log(filenameInput);
  document.getElementById("recordingButton").onclick = async (e) => {
    e.preventDefault();
    if (recordingStatus) {
      recordingStatus = false;
      e.target.textContent = "Grabar";
      filenameInput.disabled = false;
      await socket.send(JSON.stringify({ cmd: "stop-recording" }));
    } else {
      recordingStatus = true;
      e.target.textContent = "Parar grabación";
      filenameInput.disabled = true;
      console.log(filenameInput);
      await socket.send(
        JSON.stringify({ cmd: "start-recording", name: filenameInput.value }),
      );
    }
  };

  document.getElementById("clearGraphsButton").onclick = (e) => {
    e.preventDefault();
    sensorsChart.data.datasets.forEach((dataset) => {
      dataset.data.length = 0;
    });
    sensorsChart.update();
  };
};
