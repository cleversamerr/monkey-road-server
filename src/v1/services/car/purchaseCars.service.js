const { PurchaseCar } = require("../../models/car/purchaseCar.model");
const { brandsService } = require("../../services");
const localStorage = require("../../services/storage/localStorage.service");
const { ApiError } = require("../../middleware/apiError");
const httpStatus = require("http-status");
const errors = require("../../config/errors");

module.exports.getCar = async (carId) => {
  try {
    const purchaseCar = await PurchaseCar.findById(carId);
    if (!purchaseCar) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.notFound;
      throw new ApiError(statusCode, message);
    }

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};

module.exports.getRecentlyArrivedCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getLatestModelsCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({}).skip(skip).limit(10);
    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getBestSellerCars = async (skip) => {
  try {
    const purchaseCars = await PurchaseCar.find({})
      .sort({ model: 1 })
      .skip(skip)
      .limit(10);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.searchRentCars = async (searchTerm, skip) => {
  try {
    const purchaseCars = await PurchaseCar.aggregate([
      { $match: { $text: { $search: searchTerm } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $skip: skip },
      { $limit: 10 },
    ]);

    if (!purchaseCars || !purchaseCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.purchaseCar.noSearchCars;
      throw new ApiError(statusCode, message);
    }

    return purchaseCars;
  } catch (err) {
    throw err;
  }
};

module.exports.getMyCars = async (user, skip) => {
  try {
    const myCars = await PurchaseCar.find({ "owner.ref": user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10);

    if (!myCars || !myCars.length) {
      const statusCode = httpStatus.NOT_FOUND;
      const message = errors.rentCar.noPostedCars;
      throw new ApiError(statusCode, message);
    }

    return myCars;
  } catch (err) {
    throw err;
  }
};

module.exports.addCar = async (
  user,
  name,
  vin,
  model,
  brandId,
  year,
  color,
  trimLevel,
  vehicleType,
  fuelType,
  noOfSeats,
  kiloPerHour,
  price,
  phoneNumber,
  description,
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6
) => {
  try {
    const brand = await brandsService.getBrand(brandId);

    const purchaseCar = new PurchaseCar({
      owner: {
        name: user.name,
        ref: user._id,
      },
      name,
      vin,
      model,
      brand: {
        name: {
          en: brand.name.en,
          ar: brand.name.ar,
        },
        ref: brand._id,
      },
      year,
      color,
      trimLevel,
      vehicleType,
      fuelType,
      noOfSeats,
      kiloPerHour,
      price,
      phoneNumber,
      description,
    });

    if (photo1) {
      const photo = await localStorage.storeFile(photo1);
      purchaseCar.photos.push(photo.path);
    }

    if (photo2) {
      const photo = await localStorage.storeFile(photo2);
      purchaseCar.photos.push(photo.path);
    }

    if (photo3) {
      const photo = await localStorage.storeFile(photo3);
      purchaseCar.photos.push(photo.path);
    }

    if (photo4) {
      const photo = await localStorage.storeFile(photo4);
      purchaseCar.photos.push(photo.path);
    }

    if (photo5) {
      const photo = await localStorage.storeFile(photo5);
      purchaseCar.photos.push(photo.path);
    }

    if (photo6) {
      const photo = await localStorage.storeFile(photo6);
      purchaseCar.photos.push(photo.path);
    }

    await purchaseCar.save();

    return purchaseCar;
  } catch (err) {
    throw err;
  }
};