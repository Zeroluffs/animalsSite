import axios from "axios";

const BASE_URL = "https://65f394fe105614e654a0ac9d.mockapi.io/api/v1/animals";

// Function to handle errors
const handleErrors = (error) => {
  console.error("An error occurred:", error);
  throw error;
};

// Function to handle GET request
export const getAnimals = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

// Function to handle POST request
export const addAnimal = async (animal) => {
  try {
    const response = await axios.post(BASE_URL, animal);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

// Function to handle PUT request
export const updateAnimal = async (animal) => {
  try {
    const response = await axios.put(`${BASE_URL}/${animal.id}`, {
      next_checkup: animal.date,
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

// Function to handle DELETE request
export const deleteAnimal = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};
