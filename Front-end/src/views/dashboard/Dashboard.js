import React from 'react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import LiveChar from '../widgets/LiveChar'
import { CCol, CRow } from '@coreui/react'
import ButtonControll from '../widgets/ButtonControll'

const Dashboard = () => {

  return (
    <>
      <div style={{ marginBottom: '50px', marginTop: '40px' }}>
        <WidgetsDropdown />
      </div>
      <CRow>
        <CCol sm={8}>
          <LiveChar />
        </CCol>
        <CCol sm={4}>
          <ButtonControll/>
        </CCol>
      </CRow>

    </>
  )
}

export default Dashboard
