"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Copy, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Row {
  [key: string]: any;
}

export default function ResultsPage() {
  const params = useSearchParams();
  const query = params.get("text_query") || "";
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const resp = await axios.post("/api/sql_query", {
          text_query: query,
        });
        setRows(resp.data.data);
        setExecutionTime(Date.now() - startTime);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message);
        setExecutionTime(Date.now() - startTime);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const copyResults = () => {
    if (rows) {
      navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResults = () => {
    if (rows) {
      const dataStr = JSON.stringify(rows, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'query_results.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <Card className="card-enhanced max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No Query Provided</h2>
            <p className="text-slate-600 mb-4">Please provide a SQL query to execute.</p>
            <Link href="/query">
              <Button className="button-primary">
                <ArrowLeft className="w-4 h-4" />
                Back to Query Editor
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between fade-in">
          <div className="flex items-center space-x-4">
            <Link href="/query">
              <Button variant="outline" className="nav-link">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Query Results</h1>
              <p className="text-slate-600">Execution completed</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          {rows && (
            <div className="flex items-center space-x-3">
              <Button 
                onClick={copyResults}
                variant="outline"
                className="nav-link"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button 
                onClick={downloadResults}
                className="button-primary"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          )}
        </div>

        {/* Query Info Card */}
        <Card className="card-enhanced fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Executed Query</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="code-block">
              <pre className="whitespace-pre-wrap">{query}</pre>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Execution time: {executionTime}ms</span>
                </div>
                {rows && (
                  <div>
                    <span>Rows returned: {rows.length}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="spinner"></div>
                    <span>Executing...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Error</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Success</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <Card className="card-enhanced fade-in">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="spinner mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Executing Query</h3>
                <p className="text-slate-600">Please wait while we process your request...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="card-enhanced fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>Query Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="error-block">
                <pre className="text-sm whitespace-pre-wrap font-mono">{error}</pre>
              </div>
            </CardContent>
          </Card>
        ) : rows && rows.length > 0 ? (
          <Card className="card-enhanced fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Query Results ({rows.length} rows)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="code-block max-h-96 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(rows, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ) : rows && rows.length === 0 ? (
          <Card className="card-enhanced fade-in">
            <CardContent className="py-12 text-center">
              <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Results Found</h3>
              <p className="text-slate-600">Your query executed successfully but returned no rows.</p>
            </CardContent>
          </Card>
        ) : null}

        {/* Query Statistics */}
        {rows && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
            <div className="metric-card">
              <div className="metric-value">{rows.length}</div>
              <div className="metric-label">Rows Returned</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{executionTime}ms</div>
              <div className="metric-label">Execution Time</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{rows.length > 0 ? Object.keys(rows[0]).length : 0}</div>
              <div className="metric-label">Columns</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}