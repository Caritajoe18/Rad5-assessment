import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),
  password: Joi.string()
    .min(5)
    .regex(/^[a-zA-Z0-9]{5,10}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 5 characters long",
      "string.pattern.base":
        "Password must be between 5 and 10 characters and contain only letters and numbers",
    }),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("confirm password")
    .messages({
      "any.only": "{{#label}} does not match",
      "any.required": "Confirm password is required",
    }),
}).options({ abortEarly: false });

export const loginUserSchema = Joi.object({
  username: Joi.string().trim().lowercase().required().messages({
    "string.empty": "Username is required",
  }),
  password: Joi.string()
    .min(5)
    .regex(/^[a-zA-Z0-9]{5,10}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 5 characters long",
      "string.pattern.base":
        "Password must be between 5 and 10 characters and contain only letters and numbers",
    }),
});

export const createTodoSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  dueDate: Joi.string().isoDate().required().messages({
    "string.empty": "Due date is required",
    "string.isoDate": "Due date must be in YYYY-MM-DD format",
  }),
}).options({ abortEarly: false }); 

export const updateTodoSchema = Joi.object({
  title: Joi.string().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().messages({
    "string.empty": "Description is required",
  }),
  dueDate: Joi.string().required().messages({
    "string.empty": "Due date is required",
  }),
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
  }),
});
