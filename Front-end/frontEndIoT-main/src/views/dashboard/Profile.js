import { CCard, CCol, CContainer, CImage, CRow } from '@coreui/react'
import React from 'react'

const Profile = () => {
  return (
    <>
      <CContainer>
        <CCard style={{ height: "500px", overflow: "hidden" }}>
          <CImage fluid rounded src="./img\back3.jpg" />
        </CCard>
        <CCard style={{
          padding: "50px",
          marginTop: "-200px",
          marginLeft: "100px",
          marginRight: "100px"
        }}>
          <CRow>
            <CCol sm={5}>
              <CImage align="start" rounded src="./img\avatar.jpg" width={200} height={200} />
            </CCol>
            <CCol sm={7}>
              <h2>Nguyễn Công Huân</h2>
              <p>MSV: B21DCCN403</p>
            </CCol>
          </CRow>
          <CRow>
            <p>                     </p>
            <p><strong>Class: </strong>D21CNPM04</p>
            <p><strong>Email: </strong>anhhuaan@gmail.com</p>
            <p><strong>Phone: </strong>0985889474</p>
            <p><strong>Github BE: </strong><a href="https://github.com/CongHuaan/IoT" target="_blank" rel="noopener noreferrer">https://github.com/CongHuaan/IoT</a></p>
            <p><strong>Github FE: </strong><a href="https://github.com/CongHuaan/frontEndIoT" target="_blank" rel="noopener noreferrer">https://github.com/CongHuaan/frontEndIoT</a></p>
            <p><strong>PDF: </strong><a href="https://drive.google.com/file/d/1MMFkZxNsw3i8MauNIGArU4Dh_B3Hwdy7/view?usp=sharing" target="_blank" rel="noopener noreferrer">Báo cáo</a></p>
            <p><strong>Apidoc: </strong><a href="http://localhost:3001/api#/" target="_blank" rel="noopener noreferrer">Swagger API IoT</a></p>
          </CRow>
        </CCard>
      </CContainer>
    </>
  )
}

export default Profile