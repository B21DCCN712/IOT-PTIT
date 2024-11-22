import React, { useEffect, useState } from "react";
import {
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTable,
  CTableRow,
  CTableDataCell,
  CCard,
  CButton,
  CFormInput,
  CInputGroup,
} from "@coreui/react";
import { format } from "date-fns/format";

const DataLed = () => {
  const [leds, setLeds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);

  const fetchLeds = async (page, limit) => {
    try {
      const response = await fetch(
        `http://localhost:3001/led/paginated?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setLeds(data.data);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.log("Fetch Error:", err); // Log errors
    }
  };

  useEffect(() => {
    fetchLeds(page, limit);
  }, [page, limit]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      setPage(1);
      fetchLeds(1, newLimit);
    }
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
    <>
      <CCard>
        <CTable>
          <CTableHead>
            <CTableRow color="dark">
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Time update</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {leds.map((led) => (
              <CTableRow key={led.id}>
                <CTableDataCell>{led.id}</CTableDataCell>
                <CTableDataCell>{led.name}</CTableDataCell>
                <CTableDataCell>{led.status}</CTableDataCell>
                <CTableDataCell>{formatDate(led.time_updated)}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="position-relative my-3 mx-3">
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
      </CCard>
    </>
  );
};

export default DataLed;
