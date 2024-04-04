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
import { AnimalList } from "./components/AnimalList.jsx";

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

export default App;
