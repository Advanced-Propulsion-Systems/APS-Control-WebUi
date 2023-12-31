import useSWR from "swr";
import { useParams, Link } from "react-router-dom";
import "chart.js/auto";
import { Scatter } from "react-chartjs-2";
import { useState } from "react";
import { parse } from "csv-parse/sync";

export default function RecordingShow() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const {
    data: recording,
    isLoading,
    mutate,
  } = useSWR(
    import.meta.env.VITE_API_URL + "/recordings/" + useParams().recordingId,
    fetcher,
  );

  const csvFetcher = (...args) =>
    fetch(...args)
      .then((res) => res.text())
      .then((text) =>
        parse(text, {
          columns: true,
          cast: (value, context) => {
            if (context.header) {
              return value;
            }
            return value === "" ? null : parseFloat(value);
          },
        }),
      )
      .then((data) => {
        if (data.length === 0) {
          return [];
        }

        const headers = Object.keys(data[0]).filter(
          (header) => header !== "time",
        );
        return headers.map((header) => {
          return {
            data,
            label: header,
            parsing: { xAxisKey: "time", yAxisKey: header },
          };
        });
      });
  const { data: datasets, isChartLoading } = useSWR(
    import.meta.env.VITE_API_URL +
      "/recordings/" +
      useParams().recordingId +
      "/data",
    csvFetcher,
  );

  if (!isChartLoading) {
    console.log("loaded");
    console.log(datasets);
  } else {
    console.log("Not loaded");
    console.log(datasets);
  }

  const chartOptions = {
    animation: true,
    showLine: true,
    spanGaps: true,
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
            <Scatter
              data={isChartLoading ? { datasets: [] } : { datasets: datasets }}
              options={chartOptions}
            />
          )}
        </>
      )}
    </>
  );
}
