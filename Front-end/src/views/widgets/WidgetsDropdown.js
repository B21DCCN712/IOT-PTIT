import React, { useEffect, useState, memo } from "react";
import { CRow, CCol } from "@coreui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faThermometerHalf, faSun } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';

const WidgetsDropdown = () => {
  const [sensorData, setSensorData] = useState({
    humidity: 0,
    temperature: 0,
    light: 0,
  });

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Adjust the URL to match your server

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('sensorData', (data) => {
      console.log('Received sensor data:', data);
      setSensorData(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getGradient = (value, min, max, baseColor) => {
    const ratio = (value - min) / (max - min);
    const [r, g, b] = baseColor.match(/\d+/g).map(Number);
    const darkColor = `rgba(${r}, ${g}, ${b}, 1)`;
    const lightColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    return `linear-gradient(to top, ${darkColor} ${ratio * 100}%, ${lightColor} ${ratio * 100}%)`;
  };

  const widgetStyle = (value, min, max, baseColor) => ({
    background: getGradient(value, min, max, baseColor),
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background 0.5s ease',
    padding: '20px',
    borderRadius: '10px',
    color: 'white',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    height: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  });

  const iconStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '2rem',
    color: 'white',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
  };

  const textStyle = {
    margin: 0,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
  };

  return (
    <CRow className="g-4">
      <CCol sm={6} lg={4}>
        <div style={widgetStyle(sensorData.humidity, 0, 100, 'rgb(0, 123, 255)')}>
          <FontAwesomeIcon icon={faTint} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Độ ẩm</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{sensorData.humidity}%</p>
        </div>
      </CCol>
      <CCol sm={6} lg={4}>
        <div style={widgetStyle(sensorData.temperature, 0, 45, 'rgb(255, 100, 34)')}>
          <FontAwesomeIcon icon={faThermometerHalf} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Nhiệt độ</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{parseInt(sensorData.temperature, 10)}°C</p>
        </div>
      </CCol>
      <CCol sm={6} lg={4}>
        <div style={widgetStyle(sensorData.light, 0, 1024, 'rgb(255, 190, 0)')}>
          <FontAwesomeIcon icon={faSun} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Ánh sáng</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{sensorData.light} LUX</p>
        </div>
      </CCol>
      {/* <CCol sm={6} lg={3}>
        <div style={widgetStyle(sensorData.humidity, 0, 100, 'rgb(0, 123, 255)')}>
          <FontAwesomeIcon icon={faTint} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Độ ẩm</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{sensorData.humidity}%</p>
        </div>
      </CCol>
      <CCol sm={6} lg={3}>
        <div style={widgetStyle(sensorData.temperature, 0, 45, 'rgb(255, 100, 34)')}>
          <FontAwesomeIcon icon={faThermometerHalf} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Nhiệt độ</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{parseInt(sensorData.temperature, 10)}°C</p>
        </div>
      </CCol>
      <CCol sm={6} lg={3}>
        <div style={widgetStyle(sensorData.light, 0, 1024, 'rgb(255, 190, 0)')}>
          <FontAwesomeIcon icon={faSun} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Ánh sáng</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{sensorData.light} LUX</p>
        </div>
      </CCol>
      <CCol sm={6} lg={3}>
        <div style={widgetStyle(sensorData.light, 0, 1024, 'rgb(255, 190, 0)')}>
          <FontAwesomeIcon icon={faSun} style={iconStyle} />
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>Ánh sáng</p>
          <p style={{ ...textStyle, fontSize: '1.5rem' }}>{sensorData.light} LUX</p>
        </div>
      </CCol> */}
    </CRow>
  );
};

export default memo(WidgetsDropdown);