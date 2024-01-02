import useSWR from "swr";
import { useParams, useNavigate } from "react-router-dom";
import { Link, Button } from "./components/common";
import "chart.js/auto";
import { Scatter } from "react-chartjs-2";
import { parse } from "csv-parse/sync";
import { mutate } from "swr";

export default function RecordingShow() {
	const navigate = useNavigate()
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const {
    data: recording,
    isLoading,
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
  const { data: datasets, isLoading: isChartLoading } = useSWR(
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
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleDeleteRecording = () => {
    fetch(import.meta.env.VITE_API_URL + "/recordings/" + recording.id, {
      method: "DELETE",
    }).then(() => {
	    mutate(import.meta.env.VITE_API_URL + "/recordings")
	    navigate("/grabaciones")
    });
  };

  return (
    <>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold inline">{recording.name}</h2>
            <span className="text-sm">{recording.id}</span>
          </div>
          <span>Fecha: {recording.created_at}</span>
          <span>Duración: No implementado 😖</span>

          <div className="flex flex-row justify-between items-center">
            <Link
              className="btn-primary"
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
            <Button className="btn-error" onClick={handleDeleteRecording}>
              Borrar
            </Button>
          </div>

          <div className="flex-auto">
            {isChartLoading ? (
              <span>Loading...</span>
            ) : (
              <Scatter
                className="absolute"
                data={
                  console.log(datasets) || isChartLoading
                    ? { datasets: [] }
                    : { datasets: datasets }
                }
                options={chartOptions}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
