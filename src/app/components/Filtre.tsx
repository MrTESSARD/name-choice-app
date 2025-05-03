"use client";

import { useState, ChangeEvent } from "react";
import data from "@/app/components/liste_des_prenoms.json";

// 🔠 Type des objets dans la liste
type PrenomData = {
  nombre: number;
  sexe: string;
  annee: string;
  prenoms: string;
  nombre_total_cumule: number;
};

// 🔠 Type des filtres
type Filters = {
  sexe: string;
  annee: string;
  nombre_total_cumule: string;
  prenomSearch: string;
};

// 🔠 Type du tri
type SortConfig = {
  key: keyof PrenomData | "";
  direction: "asc" | "desc";
};

const FiltreTableau = () => {
  const [filters, setFilters] = useState<Filters>({
    sexe: "",
    annee: "",
    nombre_total_cumule: "",
    prenomSearch: "",
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = (data as PrenomData[]).filter((item) => {
    return (
      (filters.sexe === "" || item.sexe === filters.sexe) &&
      (filters.annee === "" || item.annee === filters.annee) &&
      (filters.nombre_total_cumule === "" ||
        item.nombre_total_cumule === parseInt(filters.nombre_total_cumule)) &&
      item.prenoms.toLowerCase().includes(filters.prenomSearch.toLowerCase())
    );
  });

  const handleSort = (key: keyof PrenomData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

const sortedData = [...filteredData].sort((a, b) => {
  if (!sortConfig.key) return 0;

  let aVal = a[sortConfig.key];
  let bVal = b[sortConfig.key];

  if (sortConfig.key === "annee" || sortConfig.key === "nombre_total_cumule") {
    aVal = Number(aVal);
    bVal = Number(bVal);
  }

  if (typeof aVal === "string" && typeof bVal === "string") {
    return sortConfig.direction === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  } else {
    return sortConfig.direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  }
});

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          name="sexe"
          value={filters.sexe}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Sexe</option>
          <option value="F">F</option>
          <option value="M">M</option>
        </select>

        <input
          type="number"
          name="annee"
          value={filters.annee}
          onChange={handleChange}
          placeholder="Année"
          className="p-2 border rounded"
        />

        <input
          type="number"
          name="nombre_total_cumule"
          value={filters.nombre_total_cumule}
          onChange={handleChange}
          placeholder="Nombre total cumulé"
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="prenomSearch"
          value={filters.prenomSearch}
          onChange={handleChange}
          placeholder="Filtrer par prénom"
          className="p-2 border rounded"
        />
      </div>

      <p className="mb-2 text-sm text-gray-700">
        {filteredData.length} enregistrement
        {filteredData.length > 1 ? "s" : ""} trouvé
        {filteredData.length > 1 ? "s" : ""}
      </p>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {["prenoms", "sexe", "annee", "nombre_total_cumule"].map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key as keyof PrenomData)}
                className="border p-2 cursor-pointer hover:bg-gray-200"
              >
                {key === "prenoms" && "Prénom"}
                {key === "sexe" && "Sexe"}
                {key === "annee" && "Année"}
                {key === "nombre_total_cumule" && "Total Cumulé"}
                {sortConfig.key === key &&
                  (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{item.prenoms}</td>
              <td className="border p-2">{item.sexe}</td>
              <td className="border p-2">{item.annee}</td>
              <td className="border p-2">{item.nombre_total_cumule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FiltreTableau;
