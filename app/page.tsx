"use client";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

import KanbanLayout from "./components/KanbanLayout";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // to prevents hydration mismatch

  return (
    <div >
      <Navbar />
      <KanbanLayout />
    </div>
  );
}
