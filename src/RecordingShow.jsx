import useSWR from "swr";
import { useParams, Link } from "react-router-dom";
import "chart.js/auto";
import { Scatter } from "react-chartjs-2";
import { useState } from "react";

export default function RecordingShow() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [chartData, setChartData] = useState({ datasets: [] });
  const {
    data: recording,
    isLoading,
    mutate,
  } = useSWR(
    import.meta.env.VITE_API_URL + "/recordings/" + useParams().recordingId,
    fetcher,
  );

  const { data: chartCSV, isChartLoading } = useSWR(
    import.meta.env.VITE_API_URL +
      "/recordings/" +
      useParams().recordingId +
      "/data",
    (...args) => fetch(...args),
  );

  if (!isChartLoading) {
    console.log("loaded");
    console.log(chartCSV);
  } else {
    console.log("Not loaded");
    console.log(chartCSV);
  }

  const chartOptions = {
    animation: false,
    showLine: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleDeleteRecording = () => {
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
        <>
          <h2>{recording.name}</h2>
          <span>{recording.id}</span>
          <br />
          <span>Fecha: {recording.created_at}</span>
          <br />
          <span>Duración: No implementado 😖</span>
          <br />

          <Link
            to={
              import.meta.env.VITE_API_URL +
              "/recordings/" +
              recording.id +
              "/data"
            }
            download
          >
            Descargar
          </Link>
          <button onClick={handleDeleteRecording}>Borrar</button>

          {isChartLoading ? (
            <span>Loading...</span>
          ) : (
            <Scatter data={chartData} />
          )}
        </>
      )}
    </>
  );
}
