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
	const socket = new WebSocket("ws://localhost:8000/live/ws")
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

	let recordingStatus = false
	document.getElementById("recordingButton").onclick = e => {
		e.preventDefault()
		if (recordingStatus) {
			
		} else {

		}
	}

}
