import React from 'react'
import ReactDOM from 'react-dom/client'
import Auth from './Auth'
import MainMenu from './MainMenu'
import EditAppointment from './EditAppointment'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PWAExplanation from './PWAExplaination'
import AppointmentList from './AppointmentList'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth/>,
  },
  {
    path: "/userMenu",
    element: <MainMenu/>
  },
  {
    path: "/pwa",
    element: <PWAExplanation/>
  },
  {
    path: "/appointmentList",
    element: <AppointmentList/>
  },
  {
    path: "/editAppointment/:id",
    element: <EditAppointment/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
     <RouterProvider router={router} />
)
