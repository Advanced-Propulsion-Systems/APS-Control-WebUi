import useSWR from "swr";
import { Link, Outlet } from "react-router-dom";

export default function RecordingsIndex() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: recordings, isLoading } = useSWR(
    import.meta.env.VITE_API_URL + "/recordings",
    fetcher,
  );

  return (
    <>
      {isLoading ? (
        <span>loading...</span>
      ) : (
        <ul>
          {recordings.map((recording) => {
            return (
              <li key={recording.id}>
                <Link to={"/grabaciones/" + recording.id}>
                  {recording.name}
                  <br />
                  {recording.created_at}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Outlet />
    </>
  );
}
