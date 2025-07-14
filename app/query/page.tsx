"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormValues {
  text_query: string;
}

export default function QueryPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    // Navigate to /results, passing the query in the URL
    const encoded = encodeURIComponent(data.text_query);
    router.push(`/results?text_query=${encoded}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        margin: 0,
      }}
    >
      <h1>Query page</h1>
      <Input
        {...register("text_query", { required: true })}
        style={{ width: "300px", color: "white" }}
        placeholder="Enter your SQL query here"
      />
      <Button type="submit" variant="outline" style={{ marginTop: "1rem" }}>
        Run Query
      </Button>
    </form>
  );
}
