import useSWR from "swr";

export default function RecordingsIndex() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const {
    data: recordings,
    isLoading,
    mutate,
  } = useSWR(import.meta.env.VITE_API_URL + "/recordings", fetcher);

  const handleDeleteRecording = (recording) => {
    fetch(import.meta.env.VITE_API_URL + "/recordings/" + recording.id, {
      method: "DELETE",
    });
    mutate();
  };

  return (
    <>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <ul>
          {recordings.map((recording) => {
            return (
              <li>
                {`Nombre: ${recording.name}, Fecha: ${recording.created_at}, ID: ${recording.id}`}
                <a
                  href={
                    import.meta.env.VITE_API_URL + "/recordings/" + recording.id
                  }
                >
                  Descargar
                </a>
                <button onClick={() => handleDeleteRecording(recording)}>
                  Borrar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
