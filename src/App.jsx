import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import "./App.css";
import { getAnimals } from "./services/requests.js";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h2>Animal List</h2>
      {data.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
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
