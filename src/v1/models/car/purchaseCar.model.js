const { Schema, model, Types } = require("mongoose");
const CARS = require("../../data/cars");
const {
  purchaseCar: validation,
} = require("../../middleware/validation/models");

// The data that will be received by the client side
const CLIENT_SCHEMA = [
  "_id",
  "owner",
  "name",
  "vin",
  "model",
  "brand",
  "year",
  "color",
  "trimLevel",
  "vehicleType",
  "fuelType",
  "noOfSeats",
  "kiloPerHour",
  "price",
  "phoneNumber",
  "description",
  "photos",
  "creationDate",
];

// The default schema of the model
const purchaseCarSchema = new Schema(
  {
    // To figure out which user has posted this car for sale
    owner: {
      name: {
        type: String,
        requied: true,
      },
      ref: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    // The name of the car
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.name.minLength,
      maxLength: validation.name.maxLength,
    },
    // The VIN number of the car
    vin: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.vin.exactLength,
      maxLength: validation.vin.exactLength,
    },
    // The model of the car
    model: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.model.minLength,
      maxLength: validation.model.maxLength,
    },
    // The brand/manufacturer of the car
    brand: {
      name: {
        en: {
          type: String,
          required: true,
        },
        ar: {
          type: String,
          required: true,
        },
      },
      ref: {
        type: Types.ObjectId,
        required: true,
        ref: "Brand",
      },
    },
    // The car's release date
    year: {
      type: String,
      required: true,
      trim: true,
      enum: CARS.YEARS,
    },
    // The color of the car
    color: {
      type: String,
      required: true,
      trim: true,
      enum: CARS.COLORS,
    },
    // The trim level of the car
    trimLevel: {
      type: String,
      required: true,
      trim: true,
      enum: CARS.TRIM_LEVELS,
    },
    // The type of the vehicle
    vehicleType: {
      en: {
        type: String,
        required: true,
        trim: true,
        enum: CARS.VEHICLE_TYPES.EN,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        enum: CARS.VEHICLE_TYPES.AR``,
      },
    },
    // The fuel type of the car
    fuelType: {
      en: {
        type: String,
        required: true,
        trim: true,
        enum: CARS.FUEL_TYPES.EN,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        enum: CARS.FUEL_TYPES.AR,
      },
    },
    // The number of seats availabel in the car
    noOfSeats: {
      type: Number,
      required: true,
      enum: CARS.SEATS_NUMBER,
    },
    // The velocity of the car per km/h
    kiloPerHour: {
      type: Number,
      required: true,
      min: validation.kiloPerHour.min,
      max: validation.kiloPerHour.max,
    },
    // The price of the car
    price: {
      type: Number,
      required: true,
      min: validation.price.daily.min,
      max: validation.price.daily.max,
    },
    // The phone number of the car's owner
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minLength: validation.phoneNumber.minLength,
      maxLength: validation.phoneNumber.maxLength,
    },
    // The description of the car
    description: {
      type: String,
      required: false,
      trim: true,
      minLength: validation.description.minLength,
      maxLength: validation.description.maxLength,
    },
    // The photos of the car
    photos: {
      type: Array,
      required: true,
      min: validation.photos.min,
      max: validation.photos.max,
    },
    // The date of adding this car
    creationDate: {
      type: String,
      required: true,
      default: new Date(),
    },
  },
  {
    // To not avoid empty object when creating the document
    minimize: false,
    // To automatically write creation/update timestamps
    // Note: the update timestamp will be updated automatically
    timestamps: true,
  }
);

// Because the seller needs to read their own cars
// and this process will happen a lot in the application
// and we can not let mongodb to do a COLLSACAN
purchaseCarSchema.index({ owner: 1 });

// We create three indexes here because we use these fields
// in search filters.
// To speed up the search operation.
purchaseCarSchema.index({ brand: 1 });
purchaseCarSchema.index({ color: 1 });
purchaseCarSchema.index({ year: 1 });

// Creating a text index based on multiple fields to enhance
// search alogrithms and reach more relevant search results.
rentCarSchema.index({
  name: "text",
  "owner.name": "text",
  model: "text",
  "brand.name.en": "text",
  "brand.name.ar": "text",
  "color.en": "text",
  "color.ar": "text",
  year: "text",
  description: "text",
  vin: "text",
  trimLevel: "text",
  "vehicleType.en": "text",
  "vehicleType.ar": "text",
  "fuelType.en": "text",
  "fuelType.ar": "text",
});

// Creating the model
const PurchaseCar = model("PurchaseCar", purchaseCarSchema);

// Exporting shared data about the model
module.exports = {
  PurchaseCar,
  CLIENT_SCHEMA,
  SUPPORTED_ROLES,
};