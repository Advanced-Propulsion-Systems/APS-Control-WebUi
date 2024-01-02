import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import RecordingsIndex from "./RecordingsIndex.jsx";
import RecordingShow from "./RecordingShow.jsx";
import "./index.css";
import { NavLink } from "./components/common.jsx";

const router = createBrowserRouter([
  {
    element: (
      <>
        <nav className="py-3">
          <h1 className="text-3xl inline px-5">APS🚀</h1>
          <NavLink to="/">Gráfico</NavLink>
          <NavLink to="/grabaciones">Grabaciones</NavLink>
        </nav>
        <main className="flex-auto flex">
          <Outlet />
        </main>
      </>
    ),
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/grabaciones",
        element: <RecordingsIndex />,
        children: [
          {
            index: true,
            element: <span>hola</span>,
          },
          {
            path: ":recordingId",
            element: <RecordingShow />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
