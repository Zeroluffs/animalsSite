import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "react-query";
import { deleteAnimal, getAnimals, updateAnimal } from "./services/requests.js";
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
  Modal,
  Box,
  Stack,
} from "@mui/material";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
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
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCheckupDate, setNewCheckupDate] = useState("");

  useEffect(() => {
    if (data) {
      const types = [...new Set(data.map((animal) => animal.type))];
      setAnimalTypes(types);
    }
  }, [data]);

  const { mutate: updateAnimalMutation } = useMutation(updateAnimal, {
    onSuccess: () => {
      queryClient.invalidateQueries("animals");
      setModalOpen(false);
    },
  });

  const { mutate: deleteAnimalMutation } = useMutation(deleteAnimal, {
    onSuccess: () => {
      queryClient.invalidateQueries("animals");
    },
  });

  const handleSortByAge = () => {
    setSortByAge(!sortByAge);
  };

  const handleFilterAgeChange = (event) => {
    setFilterAge(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleShareButtonClick = (animal) => {
    setSelectedAnimal(animal);
    setModalOpen(true);
  };

  const handleDeleteButtonClick = (id) => {
    deleteAnimalMutation(id);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNewCheckupDate("");
  };

  const handleCheckupDateChange = (event) => {
    setNewCheckupDate(event.target.value);
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
      <div className="flex flex-wrap">
        {filteredAnimals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onShareButtonClick={handleShareButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
      </div>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Checkup Date
          </Typography>
          <TextField
            id="checkup-date"
            label="New Checkup Date"
            type="date"
            defaultValue=""
            InputLabelProps={{
              shrink: true,
            }}
            value={newCheckupDate}
            onChange={handleCheckupDateChange}
            style={{ marginBottom: "20px" }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleModalClose} variant="contained">
              Cancel
            </Button>
            <Button
              onClick={() => {
                const updatedAnimal = {
                  id: selectedAnimal.id,
                  date: newCheckupDate,
                };
                updateAnimalMutation(updatedAnimal);
              }}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const AnimalCard = ({ animal, onShareButtonClick, onDeleteButtonClick }) => {
  const formattedNextCheckup = formatDate(animal.next_checkup);

  return (
    <Card className="m-2 flex-shrink-0" sx={{ maxWidth: 345 }}>
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
        <Button size="small" onClick={() => onShareButtonClick(animal)}>
          Update
        </Button>
        <Button
          onClick={() => onDeleteButtonClick(animal.id)}
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
