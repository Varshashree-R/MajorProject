import { useState, useCallback } from "react";
import { FormTextField, FormSelectField } from "../../components";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { locationNames } from "../../utils/locationNames";
import InfoIcon from "@mui/icons-material/Info";
import BungalowIcon from "@mui/icons-material/Bungalow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";

const UpdatePropertyForm = ({
  title,
  description,
  price,
  security_deposit,
  category,
  area,
  floors,
  furnshing,
  facing,
  address,
  parking_availability,
  isProcessing,
}) => {
  const initialFormValues = {
    price,
    security_deposit,
    description,
    location: address?.location,
    streetName: address?.streetName,
    category,
    area,
    floors,
    furnshing,
    facing,
    parking_availability,
  };
  const [values, setFormValues] = useState(initialFormValues);

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );
  return (
    <>
      <div className="flex flex-wrap flex-col gap-2 ml-5">
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <InfoIcon /> Initial Details
          </h5>
          <TextField label="Title" color="tertiary" disabled value={title} />
          <TextField
            label="Description"
            multiline
            rows={4}
            color="tertiary"
            placeholder="Description of your property"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <BungalowIcon /> Property Info
          </h5>
          <TextField
            label="Price"
            name="price"
            type="number"
            placeholder="Price"
            value={values.price}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rs.</InputAdornment>
              ),
            }}
          />
          <TextField
            label="Security_deposit"
            name="security_deposit"
            type="number"
            placeholder="security_deposit"
            value={values.security_deposit}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rs.</InputAdornment>
              ),
            }}
          />
          <FormSelectField
            label="Category"
            name="category"
            options={[
              "Independent House",
              "Building",
              "Apartment",
              "Room",
              "Villa",
              "PG",
              "Shop Space",
              "Office Space",
              "Studio",
              "Land",
              "Agriculture land",
            ]}
            value={values.category}
            handleChange={handleChange}
          />

          <TextField
            label="Area"
            name="area"
            type="number"
            placeholder="Area of the property"
            value={values.area}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">sq. feet</InputAdornment>
              ),
            }}
          />

          <TextField
            label="Floors"
            name="floors"
            type="number"
            placeholder="Number of floors if applicable or else put NO "
            value={values.floors}
            color="tertiary"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">floors</InputAdornment>
              ),
            }}
          />

          <FormSelectField
            label="Furnishing"
            name="furnshing"
            options={[
              "Fully Furnished",
              "Semi-Furnished",
              "Unfurnished"
            ]}
            value={values.furnshing}
            handleChange={handleChange}
          />

          <FormSelectField
            label="Property Facing"
            name="facing"
            options={[
              "North",
              "South",
              "East",
              "West",
              "North-East",
              "North-West",
              "South-East",
              "South-West",
              "Not applicable",
            ]}
            value={values.facing}
            handleChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-4 my-2">
          <h5 className="mb-1">
            <LocationOnIcon /> Address
          </h5>
          <FormSelectField
            label="Location"
            name="location"
            options={locationNames}
            value={values.location}
            handleChange={handleChange}
          />
          <FormTextField
            label="Street Name / Landmark"
            name="streetName"
            type={"text"}
            value={values.streetName}
            handleChange={handleChange}
          />
          <FormTextField label="City" 
          name="city"
            type={"text"}
            value={values.city}
            handleChange={handleChange}
             />

          <FormSelectField
            label="Parking Availability"
            name="parking_availability"
            options={[
              "yes",
              "no",
            ]}
            value={values.parking_availability}
            handleChange={handleChange}
          />
        </div>
      </div>

      <div className="text-center mt-2">
        <Button
          disabled={isProcessing}
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
              opacity: [0.9, 0.8, 0.7],
            },
            width: "25%",
          }}
        >
          {isProcessing ? (
            <CircularProgress
              size={26}
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </>
  );
};

export default UpdatePropertyForm;
