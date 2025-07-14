"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Play, Code, History } from "lucide-react";

interface FormValues {
  text_query: string;
}

export default function QueryPage() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const queryValue = watch("text_query", "");

  const onSubmit = (data: FormValues) => {
    const encoded = encodeURIComponent(data.text_query);
    router.push(`/results?text_query=${encoded}`);
  };

  const sampleQueries = [
    {
      title: "Customer Loans",
      query: "SELECT * FROM tblLoan WHERE clientId = 123 LIMIT 10",
      description: "Get all loans for a specific customer"
    },
    {
      title: "Active Loans Count",
      query: "SELECT COUNT(*) as active_loans FROM tblLoan WHERE isActive = 1",
      description: "Count all active loans in the system"
    },
    {
      title: "Recent Applications",
      query: "SELECT * FROM tblLoan ORDER BY creationTime DESC LIMIT 5",
      description: "Get the 5 most recent loan applications"
    },
    {
      title: "High Value Loans",
      query: "SELECT * FROM tblLoan WHERE loanAmountApproved > 500000",
      description: "Find loans with amount greater than 5 lakhs"
    }
  ];

  const handleSampleQuery = (query: string) => {
    const form = document.querySelector('textarea') as HTMLTextAreaElement;
    if (form) {
      form.value = query;
      form.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            SQL Query Interface
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Execute custom database queries to analyze loan data and generate insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Query Input Section */}
          <div className="lg:col-span-2 fade-in">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-slate-600" />
                  <span>Query Editor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      SQL Query
                    </label>
                    <textarea
                      {...register("text_query", { required: true })}
                      className="w-full h-40 p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                      placeholder="Enter your SQL query here...
Example: SELECT * FROM tblLoan WHERE isActive = 1 LIMIT 10"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      Query length: {queryValue.length} characters
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!queryValue.trim()}
                      className="button-primary"
                    >
                      <Play className="w-4 h-4" />
                      Execute Query
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Query Tips */}
            <Card className="card-enhanced mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Query Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800">Available Tables</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• <code className="bg-slate-100 px-1 rounded">tblLoan</code> - Loan records</li>
                      <li>• <code className="bg-slate-100 px-1 rounded">tblClient</code> - Customer data</li>
                      <li>• <code className="bg-slate-100 px-1 rounded">tblMobile</code> - Phone numbers</li>
                      <li>• <code className="bg-slate-100 px-1 rounded">tblPersonMobile</code> - Person-phone mapping</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800">Best Practices</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Always use LIMIT for large datasets</li>
                      <li>• Use WHERE clauses to filter results</li>
                      <li>• Be careful with UPDATE/DELETE queries</li>
                      <li>• Test queries with small datasets first</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Queries */}
          <div className="fade-in">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-slate-600" />
                  <span>Sample Queries</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleQueries.map((sample, index) => (
                  <div 
                    key={sample.title}
                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
                    onClick={() => handleSampleQuery(sample.query)}
                  >
                    <h4 className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                      {sample.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">{sample.description}</p>
                    <code className="text-xs bg-slate-100 p-2 rounded block font-mono text-slate-700">
                      {sample.query}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}