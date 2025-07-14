"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";//usesearchParams uses the url to seach for the query parameter
import axios from "axios";

interface Row {
  [key: string]: any;
}

export default function ResultsPage() {
  const params = useSearchParams();
  const query = params.get("text_query") || "";
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      try {
        const resp = await axios.post("/api/sql_query", {
          text_query: query,
        });
        setRows(resp.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message);
      }
    };
    fetchData();
  }, [query]);

  if (!query) {
    return <p style={{ padding: 20 }}>No query provided.</p>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h2>Error</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  if (rows === null) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  
  return (
    <div style={{ padding: 20 }}>
      <h1>Results</h1>
      <textarea
        readOnly
        rows={10}
        style={{
          width: "100%",
          fontFamily: "monospace",
          backgroundColor: "#111",
          color: "#0f0",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        value={JSON.stringify(rows, null, 2)}
      />
    </div>
  );
}