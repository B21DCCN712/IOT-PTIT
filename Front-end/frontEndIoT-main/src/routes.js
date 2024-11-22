import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/dashboard/Profile'))
const DataLed = React.lazy(() => import('./views/dashboard/DataLed'))
const DataSensor = React.lazy(() => import('./views/dashboard/DataSensor'))



const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/datasensor', name: 'DataSensor', element: DataSensor },
  { path: '/dataled', name: 'DataLed', element: DataLed },
  { path: '/', exact: true, name: 'Home' },
]

export default routes
