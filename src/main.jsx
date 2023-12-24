import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import RecordingsIndex from "./RecordingsIndex.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    element: (
      <>
        <nav>
          <h1>APS</h1>
          <Link to="/">Gráfico</Link>
          <Link to="/grabaciones">Grabaciones</Link>
        </nav>
        <main>
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
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
