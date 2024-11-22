import React, { useEffect, useRef, useState } from "react";
import { CCard, CCardBody, CCol, CRow } from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";

const LiveChar = () => {
  const data_humidity = useRef([]);
  const data_temperature = useRef([]);
  const data_light = useRef([]);
  const timeline = useRef([]);
  const [liveData, setLiveData] = useState({
    light: 0,
    humidity: 0,
    temperature: 0,
  });

  const fetchData = () => {
    fetch("http://localhost:3001/sensor/latest", {
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (data) {
          const currentTime = new Date().toLocaleTimeString();
          
          if (data_humidity.current.length >= 10) {
            data_humidity.current.shift();
            data_temperature.current.shift();
            data_light.current.shift();
            timeline.current.shift();
          }
          
          data_humidity.current.push(data.humidity);
          data_temperature.current.push(data.temperature);
          data_light.current.push(data.light);
          timeline.current.push(currentTime);

          setLiveData(data);
        }
      })
      .catch((err) => console.log("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CCard className="mb-4" style={{ height: "90%" }}>
        <CRow>
          <CCol sm={7}>
            <CCardBody>
              <CRow>
                <CCol sm={6}>
                  <h4 className="card-title mb-0">Nhiệt độ và Độ ẩm</h4>
                  <p className="small text-medium-emphasis">
                    {`Nhiệt độ: ${liveData.temperature.toFixed(2)} °C | Độ ẩm: ${liveData.humidity} %`}
                  </p>
                </CCol>
                <CCol sm={7} className="d-none d-md-block"></CCol>
              </CRow>
              <CChartLine
                style={{ height: "300px", marginTop: "40px" }}
                data={{
                  labels: timeline.current,
                  datasets: [
                    {
                      label: "Nhiệt độ",
                      backgroundColor: "transparent",
                      borderColor: getStyle("--cui-success"),
                      pointHoverBackgroundColor: getStyle("--cui-success"),
                      borderWidth: 2,
                      data: data_temperature.current,
                    },
                    {
                      label: "Độ ẩm",
                      backgroundColor: hexToRgba(getStyle("--cui-info"), 10),
                      borderColor: getStyle("--cui-info"),
                      pointHoverBackgroundColor: getStyle("--cui-info"),
                      borderWidth: 2,
                      data: data_humidity.current,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  animation: false,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(100 / 5),
                        max: 100,
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.8,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCol>
          <CCol sm={5}>
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 className="card-title mb-0">Ánh sáng</h4>
                  <p className="small text-medium-emphasis">{liveData.light} LUX</p>
                </CCol>
                <CCol sm={7} className="d-none d-md-block"></CCol>
              </CRow>
              <CChartLine
                style={{ height: "300px", marginTop: "40px" }}
                data={{
                  labels: timeline.current,
                  datasets: [
                    {
                      label: "Ánh sáng",
                      backgroundColor: "transparent",
                      borderColor: getStyle("--cui-warning"),
                      pointHoverBackgroundColor: getStyle("--cui-warning"),
                      borderWidth: 1,
                      borderDash: [8, 5],
                      data: data_light.current,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  animation: false,
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(1000 / 5),
                        max: 1000,
                      },
                      title: {
                        display: true,
                        text: 'Ánh sáng (LUX)'
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                      hoverBorderWidth: 3,
                    },
                  },
                }}
              />
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
    </>
  );
};

export default LiveChar;