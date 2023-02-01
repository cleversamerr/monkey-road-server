const httpStatus = require("http-status");
const _ = require("lodash");
const { CLIENT_SCHEMA } = require("../../models/user/user.model");
const { usersService } = require("../../services");
const success = require("../../config/success");
const errors = require("../../config/errors");

module.exports.isAuth = async (req, res, next) => {
  try {
    req.user.updateLastLogin();
    const user = await req.user.save();

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.verifyEmailOrPhone = (key) => async (req, res, next) => {
  try {
    const user = req.user;
    const { code } = req.body;

    const verifiedUser = await usersService.verifyEmailOrPhone(key, user, code);

    res.status(httpStatus.OK).json(_.pick(verifiedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.resendEmailOrPhoneVerificationCode =
  (key) => async (req, res, next) => {
    try {
      const user = req.user;
      const { lang } = req.query;

      await usersService.resendEmailOrPhoneVerificationCode(key, user, lang);

      const response = {
        ok: true,
        message: success.auth[`${key}VerificationCodeSent`],
      };

      res.status(httpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

module.exports.changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    await usersService.changePassword(user, oldPassword, newPassword);

    const response = {
      user: _.pick(user, CLIENT_SCHEMA),
      token: user.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.sendForgotPasswordCode = async (req, res, next) => {
  try {
    let { emailOrPhone, sendTo, lang } = req.query;
    if (emailOrPhone.status(" ")) {
      emailOrPhone = `+${emailOrPhone.trim()}`;
    }

    await usersService.sendForgotPasswordCode(emailOrPhone, sendTo, lang);

    const response = {
      ok: true,
      message:
        sendTo === "phone"
          ? success.auth.passwordResetCodeSentToPhone
          : success.auth.passwordResetCodeSentToEmail,
    };

    res.status(httpStatus.OK).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.handleForgotPassword = async (req, res, next) => {
  try {
    const { emailOrPhone, code, newPassword } = req.body;

    const user = await usersService.resetPasswordWithCode(
      emailOrPhone,
      code,
      newPassword
    );

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, email, phone, lang } = req.body;
    const avatar = req?.files?.avatar || null;

    const info = await usersService.updateProfile(
      lang,
      user,
      name,
      email,
      phone,
      avatar
    );

    const response = {
      user: _.pick(info.newUser, CLIENT_SCHEMA),
      changes: info.changes,
      token: info.newUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.sendNotification = async (req, res, next) => {
  try {
    const { userIds = [], title = "", body = "", data = {} } = req.body;

    const callback = (err, response) => {
      if (err) {
        const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        const message = errors.system.notification;
        const err = new ApiError(statusCode, message);
        return next(err);
      }

      res.status(httpStatus.OK).json(success.auth.notificationSent);
    };

    await usersService.sendNotification(userIds, title, body, data, callback);
  } catch (err) {
    next(err);
  }
};

module.exports.seeNotifications = async (req, res, next) => {
  try {
    const user = req.user;

    const notifications = await usersService.seeNotifications(user);

    res.status(httpStatus.OK).json({ notifications });
  } catch (err) {
    next(err);
  }
};

module.exports.clearNotifications = async (req, res, next) => {
  try {
    const user = req.user;

    const notifications = await usersService.clearNotifications(user);

    res.status(httpStatus.CREATED).json({ notifications });
  } catch (err) {
    next(err);
  }
};

module.exports.addPaymentCard = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      // Shared data
      type,
      postalCode,
      // Visa data
      visaNameOnCard,
      visaCardNumber,
      visaCVC,
      visaExpiryDate,
      // Paypal data
      paypalFirstName,
      paypalLastName,
      paypalAddressLine1,
      paypalAddressLine2,
      paypalCity,
      paypalRegion,
      paypalCountry,
    } = req.body;
  } catch (err) {
    next(err);
  }
};

module.exports.addToFavorites = async (req, res, next) => {
  try {
    const user = req.user;
    const { purchaseCarId } = req.body;

    await usersService.addToFavorites(user, purchaseCarId);

    const response = {
      ok: true,
      message: success.user.carAddedToFav,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getMyFavorites = async (req, res, next) => {
  try {
    const user = req.user;

    const favorites = await usersService.getMyFavorites(user);

    const response = {
      favorites,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteFromFavorites = async (req, res, next) => {
  try {
    const user = req.user;
    const { purchaseCarId } = req.body;

    await usersService.deleteFromFavorites(user, purchaseCarId);

    const response = {
      ok: true,
      message: success.user.carRemovedFromFav,
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

///////////////////////////// ADMIN /////////////////////////////
module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const { lang = "ar", emailOrPhone, name, email, phone } = req.body;
    const avatar = req?.files?.avatar || null;

    const info = await usersService.updateUserProfile(
      lang,
      emailOrPhone,
      name,
      email,
      phone,
      avatar
    );

    const response = {
      user: _.pick(info.newUser, CLIENT_SCHEMA),
      changes: info.changes,
      token: info.newUser.genAuthToken(),
    };

    res.status(httpStatus.CREATED).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUser = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;

    const updatedUser = await usersService.verifyUser(emailOrPhone);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.changeUserRole = async (req, res, next) => {
  try {
    const { emailOrPhone, role } = req.body;

    const updatedUser = await usersService.changeUserRole(emailOrPhone, role);

    res.status(httpStatus.CREATED).json(_.pick(updatedUser, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.findUserByEmailOrPhone = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.query;

    const user = await usersService.findUserByEmailOrPhone(
      emailOrPhone,
      "",
      true
    );

    res.status(httpStatus.OK).json(_.pick(user, CLIENT_SCHEMA));
  } catch (err) {
    next(err);
  }
};

module.exports.getCarsStatus = async (req, res, next) => {
  try {
    const status = await usersService.getCarsStatus();

    res.status(httpStatus.OK).json(status);
  } catch (err) {
    next(err);
  }
};
