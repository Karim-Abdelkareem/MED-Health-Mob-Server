import Joi from "joi";
export const userValidationSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
    "any.required": "Username is required",
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
  role: Joi.string()
    .valid("admin", "user", "general-manager", "representative")
    .default("user"),
  debt: Joi.number().default(0),
  active: Joi.boolean().default(false),
  pharmacyName: Joi.string().allow(null, ""), // optional
  location: Joi.string().allow(null, ""),
  address: Joi.string().allow(null, ""),
  city: Joi.string().allow(null, ""),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  }),
});
