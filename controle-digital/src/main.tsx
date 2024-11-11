// Corrigido o arquivo de inicialização do React
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { DataProvider } from "./contexts/DataContext";
import { SideBarProvider } from "./contexts/SidebarContext";
import ErrorPage from "./errorPage";
import About from "./routes/About";
import Dashboard from "./routes/Dashboard";
import Mathematic from "./routes/Mathematic";
import Statistics from "./routes/Statistics";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/statistics",
        element: <Statistics />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/mathematic",
        element: <Mathematic />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/about",
        element: <About />,
        errorElement: <ErrorPage />,
    }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SideBarProvider>
        <DataProvider>
            <RouterProvider router={router}/>
        </DataProvider>
    </SideBarProvider>
  </React.StrictMode>,
);
