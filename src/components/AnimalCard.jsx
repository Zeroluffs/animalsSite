import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const AnimalCard = ({
  animal,
  onShareButtonClick,
  onDeleteButtonClick,
}) => {
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
