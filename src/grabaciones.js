window.onload = async () => {
	const r = await fetch(process.env.API_URL + "/recordings");
	const recordings = await r.json();

	const listElement = document.getElementById("recordingsList");
	recordings.forEach(recording => {
		node = document.createElement("li")
		node.append("ID: " + recording.id + ", Fecha: " + recording.created_at)

		downloadButton = document.createElement("a")
		downloadButton.href = process.env.API_URL + "/recordings/" + recording.id
		downloadButton.append("Descargar")

		listElement.append(node)
		listElement.append(downloadButton)
	})
}
