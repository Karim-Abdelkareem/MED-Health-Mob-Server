import Joi from "joi";

export const authValidationSchema = Joi.object({
  username: Joi.string().required().pattern(/^\S+$/).messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
    "string.pattern.base": "Username must not contain spaces",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters long, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  role: Joi.string().default("user"),
  debt: Joi.number().default(0),
  pharmacyName: Joi.string().required().messages({
    "string.empty": "Pharmacy name is required",
    "any.required": "Pharmacy name is required",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Location is required",
    "any.required": "Location is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required",
    "any.required": "City is required",
  }),
  doctorId: Joi.string().required().messages({
    "string.empty": "Doctor ID is required",
    "any.required": "Doctor ID is required",
  }),
  commercialRegister: Joi.string().required().messages({
    "string.empty": "Commercial register is required",
    "any.required": "Commercial register is required",
  }),
  taxRecord: Joi.string().required().messages({
    "string.empty": "Tax record is required",
    "any.required": "Tax record is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  }),
});

export const loginValidationSchema = Joi.object({
  username: Joi.string().required().pattern(/^\S+$/).messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
    "string.pattern.base": "Username must not contain spaces",
  }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters long, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});
