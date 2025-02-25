"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Column } from "../types/types"; // Assuming you have these types
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import ColumnLayout from "../components/ColumnLayout";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<Column[]>([]);

  const searchParams = useSearchParams();
  const query = searchParams?.get("query")?.toLowerCase() || "";

  const columns = useSelector(
    (state: RootState) => state.columns.present.columns
  );

  useEffect(() => {
    if (query.trim()) {
      const filteredColumns = columns
        .map((column) => {
          // Filter only matching todos
          const matchingTodos = column.todos?.filter((todo) =>
            todo.content.toLowerCase().includes(query)
          );

          // If column title matches, keep the whole column (with all todos)

          if (column.title.toLowerCase().includes(query)) {
            return column; // to keep entire column

            // If only some todos match, return column with filtered todos
          } else if (matchingTodos && matchingTodos.length > 0) {
            return { ...column, todos: matchingTodos }; // to eep only matching todos
          }
          return null; // Exclude columns with no matches
        })
        .filter(Boolean) as Column[]; // Remove null values
      setSearchResults(filteredColumns);
    } else {
      setSearchResults([]); // Reset search results when query is empty
    }
  }, [query, columns]);

  return (
    <div className=" min-h-screen w-full flex flex-col gap-10 p-10 bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      {searchResults.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {searchResults.map((column) => (
            <ColumnLayout key={column.id} column={column} />
          ))}
        </div>
      ) : (
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
