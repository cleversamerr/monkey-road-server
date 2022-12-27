const commonMiddleware = require("../common");

const getAllRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const getRentCarDetailsValidator = [
  commonMiddleware.checkMongoIdParam,
  commonMiddleware.next,
];

const getSimilarRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkRentCarName,
  commonMiddleware.checkRentCarModel,
  commonMiddleware.checkRentCarENBrand,
  commonMiddleware.checkRentCarARBrand,
  commonMiddleware.checkRentCarENColor,
  commonMiddleware.checkRentCarARColor,
  commonMiddleware.checkRentCarYear,
  commonMiddleware.checkRentCarDescription,
  commonMiddleware.next,
];

const searchRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.checkSearchTerm,
  commonMiddleware.next,
];

const getMyRentCarsValidator = [
  commonMiddleware.putQueryParamsInBody,
  commonMiddleware.checkSkip,
  commonMiddleware.next,
];

const addRentCarValidator = [
  commonMiddleware.checkRentCarName,
  commonMiddleware.checkRentCarModel,
  commonMiddleware.checkRentCarENColor,
  commonMiddleware.checkRentCarARColor,
  commonMiddleware.checkBrand,
  commonMiddleware.checkRentCarYear,
  commonMiddleware.checkRentCarDailyPrice,
  commonMiddleware.checkRentCarWeeklyPrice,
  commonMiddleware.checkRentCarMonthlyPrice,
  commonMiddleware.checkRentCarDeposit,
  commonMiddleware.checkRentCarDescription,
  commonMiddleware.checkFile("photo1", ["png", "jpg", "jpeg"], true),
  commonMiddleware.checkFile("photo2", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo3", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo4", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo5", ["png", "jpg", "jpeg"], false),
  commonMiddleware.checkFile("photo6", ["png", "jpg", "jpeg"], false),
  commonMiddleware.next,
];

module.exports = {
  getAllRentCarsValidator,
  getRentCarDetailsValidator,
  getSimilarRentCarsValidator,
  searchRentCarsValidator,
  getMyRentCarsValidator,
  addRentCarValidator,
};
