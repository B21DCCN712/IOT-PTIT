import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <button onClick={() => alert('Button clicked!')} style={{ background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
          dashbroad
        </button>
        <span className="ms-1">&copy; 2024 IotLabs.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">facebook</span>
        <a href="https://web.facebook.com/cong.huaan.cter/?locale=vi_VN" target="_blank" rel="noopener noreferrer">
          Công Huân
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)