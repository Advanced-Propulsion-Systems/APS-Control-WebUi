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
      <div className="flex-auto flex flex-row items-stretch">
        <aside className="flex-none">
          {isLoading ? (
            <span>loading...</span>
          ) : (
            <ul className="menu">
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
        </aside>
        <section className="flex-auto flex flex-col">
          <Outlet />
        </section>
      </div>
    </>
  );
}
