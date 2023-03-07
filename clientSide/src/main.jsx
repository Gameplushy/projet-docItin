import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './Auth'
import MainMenu from './MainMenu'
import AppointmentForm from './AppointmentForm'
import AppointmentList from './AppointmentList'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth/>,
  },
  {
    path: "/usermenu",
    element: <MainMenu/>
  },
  {
    path: "/appointmentForm",
    element: <AppointmentForm/>
  },
  {
    path: "/appointmentList",
    element: <AppointmentList/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />,
)
