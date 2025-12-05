"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const idContext = createContext(null);

export const ParamsProvider = ({ children }) => {
  const [id, setId] = useState(undefined);
  const params = useSearchParams();

  useEffect(() => {
    let storedId = localStorage.getItem("id");

    if (!storedId) {
      const urlId = params.get("id");
      if (urlId) {
        storedId = urlId;
        localStorage.setItem("id", urlId);
      }
    }

    setId(storedId || null);
  }, [params]);

  if (id === undefined) return null;

  return (
    <idContext.Provider value={{ id, setId }}>{children}</idContext.Provider>
  );
};

export const useId = () => useContext(idContext);
