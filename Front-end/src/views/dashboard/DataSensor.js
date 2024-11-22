import React, { useState, useEffect, useCallback } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormSelect,
  CFormInput,
  CInputGroup,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { format } from "date-fns/format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const DataSensor = () => {
  const [sensors, setSensors] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [globalSearchValue, setGlobalSearchValue] = useState("");

  const fetchSensors = useCallback(
    async (page, limit, searchField, searchValue, globalSearchValue) => {
      try {
        let url = `http://localhost:3001/sensor/paginated?page=${page}&limit=${limit}`;
        if (searchField && searchValue) {
          url += `&searchField=${searchField}&searchValue=${searchValue}`;
        }
        if (globalSearchValue) {
          url += `&globalSearchValue=${globalSearchValue}`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSensors(data.data);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    },
    []
  );

  const fetchSortedSensors = useCallback(
    async (page, limit, searchField, searchValue, globalSearchValue) => {
      try {
        if (["humidity", "temperature", "light", "time_updated"].includes(sortField)) {
          let url = `http://localhost:3001/sensor/paginated?sortBy=${sortField}&order=${sortOrder}&page=${page}&limit=${limit}`;
          if (searchField && searchValue) {
            url += `&searchField=${searchField}&searchValue=${searchValue}`;
          }
          if (globalSearchValue) {
            url += `&globalSearchValue=${globalSearchValue}`;
          }
          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setSensors(data.data);
          setTotalPages(Math.ceil(data.total / limit));
        } else {
          throw new Error("Invalid sort field");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    },
    [sortField, sortOrder]
  );
  
  useEffect(() => {
    if (isSorted) {
      fetchSortedSensors(page, limit, searchField, searchValue, globalSearchValue);
    } else {
      fetchSensors(page, limit, searchField, searchValue, globalSearchValue);
    }
  }, [
    fetchSensors,
    fetchSortedSensors,
    isSorted,
    page,
    limit,
    searchField,
    searchValue,
    globalSearchValue,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setIsSorted(true);
  };

  const handleReset = () => {
    setIsSorted(false);
    setSearchField("");
    setSearchValue("");
    setGlobalSearchValue("");
    setPage(1);
    setLimit(20);
    fetchSensors(1, 20, "", "", "");
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "🔼" : "🔽";
    }
    return "🔼";
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleGlobalSearchValueChange = (e) => {
    setGlobalSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setPage(1);
    fetchSensors(1, limit, searchField, searchValue, globalSearchValue);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
      fetchSensors(1, newLimit, searchField, searchValue, globalSearchValue);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const middleIndex = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <CButton
            key={i}
            color={page === i ? "primary" : "secondary"}
            onClick={() => setPage(i)}
            className="mx-1"
          >
            {i}
          </CButton>
        );
      }
    } else {
      let startPage = Math.max(1, page - middleIndex);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = endPage - maxVisiblePages + 1;
      }

      if (startPage > 1) {
        buttons.push(
          <CButton
            key={1}
            color={page === 1 ? "primary" : "secondary"}
            onClick={() => setPage(1)}
            className="mx-1"
          >
            1
          </CButton>
        );

        if (startPage > 2) {
          buttons.push(<span key="ellipsis1">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <CButton
            key={i}
            color={page === i ? "primary" : "secondary"}
            onClick={() => setPage(i)}
            className="mx-1"
          >
            {i}
          </CButton>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(<span key="ellipsis2">...</span>);
        }

        buttons.push(
          <CButton
            key={totalPages}
            color={page === totalPages ? "primary" : "secondary"}
            onClick={() => setPage(totalPages)}
            className="mx-1"
          >
            {totalPages}
          </CButton>
        );
      }
    }

    return buttons;
  };

  return (
    <CCard>
      <CCardHeader>
        <h3>Data Sensor</h3>
      </CCardHeader>
      <CCardBody>
        <CInputGroup className="mb-3">
          <CFormInput
            type="text"
            value={globalSearchValue}
            onChange={handleGlobalSearchValueChange}
            placeholder="Global Search"
          />
          <CButton color="primary" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </CButton>
        </CInputGroup>
        <CInputGroup className="mb-3">
          <CFormSelect value={searchField} onChange={handleSearchFieldChange}>
            <option value="">Select Field</option>
            <option value="humidity">Humidity</option>
            <option value="temperature">Temperature</option>
            <option value="light">Light</option>
            <option value="time_updated">Time Updated</option>
          </CFormSelect>
          {searchField && (
            <CFormInput
              type="text"
              value={searchValue}
              onChange={handleSearchValueChange}
              placeholder={`Search ${searchField}`}
            />
          )}
          <CButton color="primary" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </CButton>
        </CInputGroup>
        <CButton color="secondary" className="mb-3" onClick={handleReset}>
          Reset
        </CButton>
        <CTable hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">
                Humidity
                <span
                  onClick={() => handleSort("humidity")}
                  style={{ cursor: "pointer" }}
                >
                  {getSortIcon("humidity")}
                </span>
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">
                Temperature
                <span
                  onClick={() => handleSort("temperature")}
                  style={{ cursor: "pointer" }}
                >
                  {getSortIcon("temperature")}
                </span>
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">
                Light
                <span
                  onClick={() => handleSort("light")}
                  style={{ cursor: "pointer" }}
                >
                  {getSortIcon("light")}
                </span>
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">
                Time update
                <span
                  onClick={() => handleSort("time_updated")}
                  style={{ cursor: "pointer" }}
                >
                  {getSortIcon("time_updated")}
                </span>
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {sensors.map((sensor) => (
              <CTableRow key={sensor.id}>
                <CTableDataCell>{sensor.id}</CTableDataCell>
                <CTableDataCell>{sensor.humidity}</CTableDataCell>
                <CTableDataCell>{sensor.temperature}</CTableDataCell>
                <CTableDataCell>{sensor.light}</CTableDataCell>
                <CTableDataCell>
                  {formatDate(sensor.time_updated)}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <div className="position-relative my-3">
          <CInputGroup style={{ width: "100px" }}>
            <CFormInput
              type="number"
              value={limit}
              onChange={handleLimitChange}
              placeholder="Limit"
              style={{ width: "100%" }}
            />
          </CInputGroup>
          <div className="position-absolute top-50 start-50 translate-middle">
            {renderPaginationButtons()}
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default DataSensor;