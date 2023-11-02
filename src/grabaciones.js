window.onload = async () => {
	const r = await fetch(process.env.API_URL + "/recordings");
	const recordings = await r.json();

	const listElement = document.getElementById("recordingsList");
	recordings.forEach(recording => {
		const node = document.createElement("li")
		node.append("Nombre: " + recording.name + ", Fecha: " + recording.created_at + ", ID: " + recording.id)

		const downloadButton = document.createElement("a")
		downloadButton.href = process.env.API_URL + "/recordings/" + recording.id
		downloadButton.append("Descargar")

		const deleteButton = document.createElement("button")
		deleteButton.onclick = async e => {
			await fetch(process.env.API_URL + "/recordings/" + recording.id, {method: "DELETE"})
		}
		deleteButton.append("Borrar")

		listElement.append(node)
		listElement.append(downloadButton)
		listElement.append(deleteButton)
	})
}
