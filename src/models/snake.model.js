
import mongoose from "mongoose";

const snakeSchema = new mongoose.Schema(
  {
    // Basic Information
    snakeName: {
      type: String,
      required: [true, "Snake name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    scientificName: {
      type: String,
      required: [true, "Scientific name is required"],
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    snakePhoto: {
      type: String,
      required: [true, "Snake photo is required"],
      trim: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    // Classification
    family: {
      type: String,
      default: "",
      trim: true,
    },

    genus: {
      type: String,
      default: "",
      trim: true,
    },

    species: {
      type: String,
      default: "",
      trim: true,
    },

    // Venom Information
    isVenomous: {
      type: Boolean,
      default: false,
    },

    venomType: {
      type: String,
      enum: [
        "Neurotoxic",
        "Hemotoxic",
        "Cytotoxic",
        "Myotoxic",
        "Cardiotoxic",
        "Mixed",
        "Non-venomous",
        "Unknown",
      ],
      default: "Unknown",
    },

    venomDescription: {
      type: String,
      default: "",
    },

    antivenom: {
      type: String,
      default: "",
    },

    medicalImportance: {
      type: String,
      default: "",
    },

    // Physical Characteristics
    averageLength: {
      type: Number,
      default: null,
      min: 0,
    },

    maxLength: {
      type: Number,
      default: null,
      min: 0,
    },

    weight: {
      type: Number,
      default: null,
      min: 0,
    },

    color: {
      type: [String],
      default: [],
    },

    lifespan: {
      type: Number,
      default: null,
      min: 0,
    },

    // Habitat & Distribution
    habitat: {
      type: [String],
      default: [],
    },

    countries: {
      type: [String],
      default: ["Bangladesh"],
    },

    distribution: {
      type: String,
      default: "",
    },

    // Behavior & Diet
    diet: {
      type: [String],
      default: [],
    },

    behavior: {
      type: String,
      default: "",
    },

    activity: {
      type: String,
      enum: ["Diurnal", "Nocturnal", "Crepuscular", "Both", "Unknown"],
      default: "Unknown",
    },

    // Reproduction
    reproduction: {
      type: String,
      enum: ["Oviparous", "Viviparous", "Ovoviviparous", "Unknown"],
      default: "Unknown",
    },

    // Conservation
    conservationStatus: {
      type: String,
      enum: [
        "Least Concern",
        "Near Threatened",
        "Vulnerable",
        "Endangered",
        "Critically Endangered",
        "Extinct in the Wild",
        "Extinct",
        "Not Evaluated",
        "Data Deficient",
        "Unknown",
      ],
      default: "Unknown",
    },

    // Safety Information
    dangerLevel: {
      type: String,
      enum: ["Low", "Moderate", "High", "Extreme", "Unknown"],
      default: "Unknown",
    },

    firstAid: {
      type: String,
      default: "",
    },

    // Project Management
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Search indexes
snakeSchema.index({
  snakeName: "text",
  scientificName: "text",
  description: "text",
  family: "text",
});

snakeSchema.index({ isPublished: 1, isFeatured: 1 });
snakeSchema.index({ countries: 1 });
snakeSchema.index({ isVenomous: 1 });
snakeSchema.index({ conservationStatus: 1 });

// Model
const Snake =
  mongoose.models.Snake ||
  mongoose.model("Snake", snakeSchema);

export default Snake;

