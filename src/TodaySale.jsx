import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./App.css";

function TodaySale() {
  const [sales, setSales] = useState([]);
  const [filterType, setFilterType] = useState("today");
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd from <input type=date>
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  

 /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;




  // Convert either yyyy-mm-dd -> dd-mm-yyyy OR pass-through if already dd-mm-yyyy
  

  // Convert either yyyy-mm-dd -> dd-mm-yyyy for display OR if already dd-mm-yyyy return as-is
  const convertToDisplay = (d) => {
    if (!d) return "";
    const parts = d.split("-");
    if (parts.length !== 3) return d;
    if (parts[0].length === 4) {
      const [y, m, dd] = parts;
      return `${dd}-${m}-${y}`;
    }
    return d; // already dd-mm-yyyy
  };

  // Merge duplicate items (by itemName)
  const mergeDuplicateItems = (list) => {
    const grouped = {};
    list.forEach((sale) => {
      if (!grouped[sale.itemName]) grouped[sale.itemName] = { ...sale };
      else {
        grouped[sale.itemName].quantity += sale.quantity;
        grouped[sale.itemName].total += sale.total;
      }
    });
    return Object.values(grouped);
  };

  // MAIN fetch — only invoked when user clicks Filter or on initial load
  // Replace the entire 'fetchSales' function with this:

const fetchSales = useCallback(async () => {
    try {
      setLoading(true);

      if (filterType === "custom") {
        if (!fromDate || !toDate) {
          alert("Please select both From and To dates, then click Filter.");
          return;
        }
      }

      let url = "";
      if (filterType === "today") url = "http://localhost:8081/sales/today";
      else if (filterType === "week") url = "http://localhost:8081/sales/week";
      else if (filterType === "month") url = "http://localhost:8081/sales/month";
      else if (filterType === "year") url = "http://localhost:8081/sales/year";
      else if (filterType === "custom") {
        // --- FIX IS HERE: Send the raw YYYY-MM-DD format (fromDate, toDate) to Java ---
        // Java SaleController's /filter endpoint expects 'from' and 'to' parameters
        // which it will parse using 'yyyy-MM-dd' and convert to 'dd-MM-yyyy' for the DB query.
        url = `http://localhost:8081/sales/filter?from=${encodeURIComponent(
          fromDate // YYYY-MM-DD
        )}&to=${encodeURIComponent(toDate)}`; // YYYY-MM-DD
      } else {
        url = "http://localhost:8081/sales/today";
      }

      const res = await axios.get(url);
      setSales(mergeDuplicateItems(res.data || []));
    } catch (err) {
      console.error("Error fetching sales:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [filterType, fromDate, toDate]);

  // initial load -> today's data
  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // when user switches to custom, clear the current data so UI indicates "no data until filter"
  useEffect(() => {
    if (filterType === "custom") {
      setSales([]);
    }
  }, [filterType]);

  const filteredSales = sales.filter((s) =>
    s.itemName.toLowerCase().includes(searchText.toLowerCase())
  );
  // filtered view for client-side search
   useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterType, sales]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredSales.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSales.length / recordsPerPage);

  const grandTotal = filteredSales.reduce((a, b) => a + b.total, 0)

  // Date range helpers for message display
  const getTodayRange = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return { from: `${dd}-${mm}-${yy}`, to: `${dd}-${mm}-${yy}` };
  };

  const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    const diffToMonday = day === 0 ? 6 : day - 1;
    monday.setDate(today.getDate() - diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d) =>
      `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${d.getFullYear()}`;
    return { from: fmt(monday), to: fmt(sunday) };
  };

  const getMonthRange = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const first = `01-${String(m).padStart(2, "0")}-${y}`;
    const lastNo = new Date(y, m, 0).getDate();
    const last = `${String(lastNo).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y}`;
    return { from: first, to: last };
  };

  const getYearRange = () => {
    const y = new Date().getFullYear();
    return { from: `01-01-${y}`, to: `31-12-${y}` };
  };

  const getRecordMessage = () => {
    if (filterType === "custom") {
      if (!fromDate || !toDate) {
        return "Custom range selected — please choose From & To dates and click Filter.";
      }
      return `Showing Records From ${convertToDisplay(fromDate)} To ${convertToDisplay(
        toDate
      )}`;
    }
    if (filterType === "today") {
      const r = getTodayRange();
      return `Showing Today's Records From ${r.from}`;
    }
    if (filterType === "week") {
      const r = getWeekRange();
      return `Showing This Week's Records From ${r.from} To ${r.to}`;
    }
    if (filterType === "month") {
      const r = getMonthRange();
      return `Showing This Month's Records From ${r.from} To ${r.to}`;
    }
    if (filterType === "year") {
      const r = getYearRange();
      return `Showing This Year's Records From ${r.from} To ${r.to}`;
    }
    return "";
  };

  // Export helpers
const exportExcel = () => {
  const reportHeader = getRecordMessage();

  const salesData = filteredSales.map((s, i) => ({
    "Sr.No": i + 1,
    Item: s.itemName,
    Price: (s.total / s.quantity).toFixed(2),
    Qty: s.quantity,
    Total: s.total.toFixed(2),
  }));

  const headerRow = [
    { "Sr.No": "", Item: reportHeader, Price: "", Qty: "", Total: "" }
  ];

  const grandTotalRow = [
    {
      "Sr.No": "",
      Item: "",
      Price: "",
      Qty: "Grand Total:",
      Total: grandTotal.toFixed(2),
    },
  ];

  const ws = XLSX.utils.json_to_sheet(headerRow);

  // Prevents duplicate column header
  XLSX.utils.sheet_add_json(ws, salesData, { origin: -1, skipHeader: true });
  
  XLSX.utils.sheet_add_json(ws, grandTotalRow, { origin: -1, skipHeader: true });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales");

  XLSX.writeFile(wb, "Sales_Report.xlsx");
};


const exportPDF = () => {
  const doc = new jsPDF();
  const reportHeader = getRecordMessage(); // <-- Add this

  doc.setFontSize(16);
  doc.text("Sales Report", 14, 10);


  // Add the selected filter date range text
  doc.setFontSize(11);
  doc.text(reportHeader, 14, 16);

  autoTable(doc, {
    startY: 22,
    head: [["Sr.No", "Item", "Price", "Qty", "Total"]],
    body: filteredSales.map((s, i) => [
      i + 1,
      s.itemName ?? "",
      Number(s.total / s.quantity || 0).toFixed(2),
      Number(s.quantity || 0).toString(),
      Number(s.total || 0).toFixed(2),
    ]),
    foot: [
      [
        { content: "Grand Total:", colSpan: 4, styles: { halign: "right" } },
        Number(grandTotal || 0).toFixed(2),
      ],
    ],
  });

  doc.save("Sales_Report.pdf");
};

return (
  <div className="sales-container">
    <h2>📊 Sales Report</h2>

    {/* ================= FILTER SECTION ================= */}
    <div className="filter-box">
      <div className="filter-left">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {filterType === "custom" && (
          <>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="date-input"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="date-input"
            />
          </>
        )}

        <button onClick={fetchSales} className="filter-btn">Filter</button>

        <button
          onClick={() => {
            setFilterType("today");
            setFromDate("");
            setToDate("");
            setSearchText("");
            fetchSales();
          }}
          className="filter-btn"
        >
          Reset
        </button>
      </div>
    </div>

    {/* ================= CONDITIONAL CONTENT ================= */}
    {loading ? (
      <p>Loading...</p>
    ) : filteredSales.length === 0 ? (
      <p className="No-records">No records found</p>
    ) : (
      <>
        {/* RECORD MESSAGE */}
        <p className="record-info">{getRecordMessage()}</p>

        {/* ACTION BUTTONS + SEARCH */}
        <div className="top-actions">
          <button onClick={exportExcel} className="excel-btn">📘 Excel</button>
          <button onClick={exportPDF} className="pdf-btn">📕 PDF</button>

          <div className="search-right">
            <input
              type="text"
              placeholder="Search Item..."
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((s, i) => (
              <tr key={i}>
                <td>{indexOfFirst + i + 1}</td>
                <td>{s.itemName}</td>
                <td>₹{(s.total / s.quantity).toFixed(2)}</td>
                <td>{s.quantity}</td>
                <td>₹{s.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

<div className="grand-total-box">
  <strong>Grand Total: </strong> ₹{grandTotal.toFixed(2)}
</div>
        {/* PAGINATION */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              className={n === currentPage ? "page-btn active" : "page-btn"}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);
}
export default TodaySale;
