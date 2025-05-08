"use client";

import { useEffect, useState, ChangeEvent } from "react";
import data from "@/app/components/liste_des_prenoms.json";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// 🔠 Type des objets dans la liste
type PrenomData = {
  nombre: number;
  sexe: "F" | "M";
  annee: string;
  prenoms: string;
  nombre_total_cumule: number;
};

type Filters = {
  sexe: string;
  annee: string;
  nombre_total_cumule: string;
  prenomSearch: string;
  longueur: string;
  commencePar: string;
  seTerminePar: string;
  noDuplicates: boolean;
  ignoreAccents: boolean;
};

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
    longueur: "",
    commencePar: "",
    seTerminePar: "",
    noDuplicates: false,
    ignoreAccents: false,
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });

  const [favoris, setFavoris] = useState<string[]>([]);
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  useEffect(() => {
    const saved = localStorage.getItem("favorisPrenoms");
    if (saved) setFavoris(JSON.parse(saved));
  }, []);

  const updateFavoris = (prenom: string) => {
    const updated = favoris.includes(prenom)
      ? favoris.filter((p) => p !== prenom)
      : [...favoris, prenom];
    setFavoris(updated);
    localStorage.setItem("favorisPrenoms", JSON.stringify(updated));
  };

  const handleChange = (e: any) => {
    console.log("e", e);
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const fuzzyMatch = (text: string, pattern: string) => {
    const regex = new RegExp(pattern.split("").join(".*"), "i");
    return regex.test(text);
  };

  let filteredData = (data as PrenomData[]).filter((item) => {
    // Fonction de normalisation des accents
    const normalize = (str: string) => {
      return filters.ignoreAccents
        ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
        : str;
    };

    return (
      (filters.sexe === "" || item.sexe === filters.sexe) &&
      (filters.annee === "" || item.annee === filters.annee) &&
      (filters.nombre_total_cumule === "" ||
        item.nombre_total_cumule === parseInt(filters.nombre_total_cumule)) &&
      (filters.longueur === "" ||
        item.prenoms.length === parseInt(filters.longueur)) &&
      // Appliquer la normalisation pour startsWith
      (filters.commencePar === "" ||
        normalize(item.prenoms)
          .toLowerCase()
          .startsWith(normalize(filters.commencePar).toLowerCase())) &&
      // Appliquer la normalisation pour seTerminePar
      (filters.seTerminePar === "" ||
        normalize(item.prenoms)
          .toLowerCase()
          .endsWith(normalize(filters.seTerminePar).toLowerCase())) &&
      // Appliquer la recherche floue avec normalisation
      fuzzyMatch(
        normalize(item.prenoms).toLowerCase(),
        normalize(filters.prenomSearch).toLowerCase()
      )
    );
  });

  if (filters.noDuplicates) {
    const seen = new Set();
    filteredData = filteredData.filter((item) => {
      const lowerPrenom = item.prenoms.toLowerCase();
      if (seen.has(lowerPrenom)) return false;
      seen.add(lowerPrenom);
      return true;
    });
  }

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

    if (
      sortConfig.key === "annee" ||
      sortConfig.key === "nombre_total_cumule"
    ) {
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

  const displayedData = sortedData.slice(0, 500);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="grid" gridTemplateColumns={{ md: "2fr 1fr" }} gap={4}>
        <Box>
          <Stack direction="row" flexWrap="wrap" spacing={2} mb={2}>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel>Sexe</InputLabel>
              <Select
                name="sexe"
                value={filters.sexe}
                onChange={handleChange}
                label="Sexe"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="F">F</MenuItem>
                <MenuItem value="M">M</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{ maxWidth: 100 }}
              type="number"
              name="annee"
              value={filters.annee}
              onChange={handleChange}
              label="Année"
              size="small"
            />
            <TextField
              type="number"
              name="nombre_total_cumule"
              value={filters.nombre_total_cumule}
              onChange={handleChange}
              label="Total cumulé"
              size="small"
            />
            <TextField
              name="prenomSearch"
              value={filters.prenomSearch}
              onChange={handleChange}
              label="Contient lettres"
              size="small"
            />
            <TextField
              type="number"
              name="longueur"
              value={filters.longueur}
              onChange={handleChange}
              label="Longueur prénom"
              size="small"
            />
          </Stack>
          <Stack direction="row" flexWrap="wrap" spacing={2} mb={2}>
            <TextField
              name="commencePar"
              value={filters.commencePar}
              onChange={handleChange}
              label="Commence par"
              size="small"
            />
            <TextField
              name="seTerminePar"
              value={filters.seTerminePar}
              onChange={handleChange}
              label="Se termine par"
              size="small"
            />
            <FormControl>
              <Checkbox
                name="noDuplicates"
                checked={filters.noDuplicates}
                onChange={handleChange}
              />
              <Typography variant="caption">Pas de doublons</Typography>
            </FormControl>
            <FormControl>
              <Checkbox
                name="ignoreAccents"
                checked={filters.ignoreAccents}
                onChange={handleChange}
              />
              <Typography variant="caption">Ignorer les accents</Typography>
            </FormControl>
          </Stack>
          <Typography variant="body2" mb={1}>
            {filteredData.length} enregistrement
            {filteredData.length > 1 ? "s" : ""} trouvé
            {filteredData.length > 1 ? "s" : ""}
          </Typography>
          {sortedData.length > 500 && (
            <Typography variant="body2" mb={1}>
              Limité à 500 résultats.
            </Typography>
          )}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["prénoms", "sexe", "année", "nombre total cumulé"].map(
                    (column) => (
                      <TableCell key={column}>
                        <Typography
                          onClick={() => handleSort(column as keyof PrenomData)}
                          sx={{ cursor: "pointer", fontWeight: "bold" }}
                        >
                          {column}
                        </Typography>
                      </TableCell>
                    )
                  )}
                  <TableCell>Favoris</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.prenoms}</TableCell>
                    <TableCell>{item.sexe}</TableCell>
                    <TableCell>{item.annee}</TableCell>
                    <TableCell>{item.nombre_total_cumule}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => updateFavoris(item.prenoms)}
                        color={
                          favoris.includes(item.prenoms) ? "primary" : "default"
                        }
                      >
                        {favoris.includes(item.prenoms) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <div>
          <h2 className="text-xl font-bold mb-2">Favoris</h2>
          <ul className="list-disc pl-5">
            {favoris.map((prenom) => (
              <li
                key={prenom}
                className="flex justify-between items-center mb-1"
              >
                {prenom}
                <button
                  className="text-red-500 text-sm"
                  onClick={() => updateFavoris(prenom)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Box>
    </Container>
  );
};

export default FiltreTableau;
