"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function DetailPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      <h2>Perfume ID: {id}</h2>
    </div>
  );
}
