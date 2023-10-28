import Chart from "chart.js/auto"

let recordingStatus = false

window.onload = () => {
  const ctx = document.getElementById('sensorsChart');
  sensorsChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: '# of Votes',
        data: [{x: 1, y: 2}],
        borderWidth: 1
      }]
    },
    options: {
	    showLine: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
	const socket = new WebSocket("ws://localhost:8000/ws")
	socket.addEventListener("message", async event => {
		console.log(event.data)
		msg = JSON.parse(event.data)
		switch (msg.type) {
			case "setup":
				sensorsChart.data.datasets = msg.sensors.map(setup => {
					return {label: setup.id}
				})
				sensorsChart.update()
				break;

			case "data":
				sensorsChart.data.datasets.forEach(dataset => {
					dataset.data.push(msg.data[dataset.label])
				})
				sensorsChart.update()
				break;

			default:
				console.log("Unknown msg type", event.data)

		}
	})

	document.getElementById("recordingButton").onclick = async e => {
		e.preventDefault()
		if (recordingStatus) {
			recordingStatus = false
			e.target.textContent = "Grabar"
			await socket.send(JSON.stringify({cmd: "stop-recording"}))
		} else {
			recordingStatus = true
			e.target.textContent = "Parar grabación"
			await socket.send(JSON.stringify({cmd: "start-recording"}))
		}
	}

}
