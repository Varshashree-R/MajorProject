import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    rent: { type: Number, required: true },
    type: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    owner: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Property", PropertySchema);

