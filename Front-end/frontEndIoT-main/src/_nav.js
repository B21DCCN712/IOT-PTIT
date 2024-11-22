import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,cilUser,cilStorage
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'DataLed',
    to: '/dataled',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'DataSensor',
    to: '/datasensor',
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  
]

export default _nav
