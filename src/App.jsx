import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { getAnimals } from "./services/requests.js";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="
      max-w-7xl mx-auto"
      >
        <AnimalList />
      </div>
    </QueryClientProvider>
  );
}

const AnimalList = () => {
  const { data, isLoading, isError } = useQuery("animals", getAnimals);
  const [filterAge, setFilterAge] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortByAge, setSortByAge] = useState(false);
  const [animalTypes, setAnimalTypes] = useState([]);

  useEffect(() => {
    if (data) {
      const types = [...new Set(data.map((animal) => animal.type))];
      setAnimalTypes(types);
    }
  }, [data]);

  const handleSortByAge = () => {
    setSortByAge(!sortByAge);
  };

  const handleFilterAgeChange = (event) => {
    setFilterAge(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  let filteredAnimals = [...data];
  if (filterAge !== "") {
    filteredAnimals = filteredAnimals.filter((animal) =>
      animal.age.toString().includes(filterAge),
    );
  }
  if (filterType !== "") {
    filteredAnimals = filteredAnimals.filter(
      (animal) => animal.type === filterType,
    );
  }
  if (sortByAge) {
    filteredAnimals.sort((a, b) => parseInt(a.age) - parseInt(b.age));
  }

  return (
    <div>
      <h2>Animal List</h2>
      <div>
        <TextField
          id="filter-age"
          label="Filter by Age"
          variant="outlined"
          value={filterAge}
          onChange={handleFilterAgeChange}
          style={{ marginRight: "20px" }}
        />
        <FormControl variant="outlined" style={{ marginRight: "20px" }}>
          <InputLabel id="filter-type-label">Filter by Type</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={filterType}
            onChange={handleFilterTypeChange}
            label="Filter by Type"
          >
            <MenuItem value="">All</MenuItem>
            {animalTypes.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleSortByAge} variant="outlined">
          {sortByAge ? "Sort by Age (Descending)" : "Sort by Age (Ascending)"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mt-12">
        {filteredAnimals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const AnimalCard = ({ animal }) => {
  const formattedNextCheckup = formatDate(animal.next_checkup);

  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {animal.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age: {animal.age} years
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {animal.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Next Checkup: {formattedNextCheckup}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button
          size="small"
          variant="contained"
          sx={{ bgcolor: "error.main", color: "white" }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default App;
