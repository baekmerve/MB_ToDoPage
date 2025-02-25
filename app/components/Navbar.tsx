"use client";
import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useRouter } from "next/navigation";

import { ModeToggle } from "../components/modeToggle";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div className="poppins gap-10 p-6 justify-between items-center flex  w-full backdrop-blur-md  ">
      <h1 className=" text-2xl font-bold "> KanBan</h1>

      <form
        onSubmit={handleSearch}
        className="flex justify-between items-center relative"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-3xl w-[400px] h-14 pl-5 border-primary shadow-none  hover:border-2 outline-none"
          placeholder="Search by title or content"
        />

        <LuSearch className=" w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2" />
      </form>

      <ModeToggle />
    </div>
  );
};

export default Navbar;
