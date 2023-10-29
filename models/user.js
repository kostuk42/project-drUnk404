const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const bCrypt = require("bcryptjs");
const crypto = require("crypto");

const Joi = require("joi");

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// User model and schemas
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Set name for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Set email for user"],
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    birthDate: Date,
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    // timestamps: true
  }
);

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

userSchema.methods.generateAvatar = function (email) {
  const emailHash = crypto
    .createHash("md5")
    .update("emailAdress")
    .digest("hex");
  this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
};

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

// Joi Schemas
const registerJoiSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "missing required username field",
  }),
  email: Joi.string()
    .required()
    .messages({
      "any.required": "missing required email field",
    })
    .pattern(emailRegexp)
    .messages({
      "string.pattern.base": "invalid email format",
    }),
  password: Joi.string()
    .required()
    .messages({
      "any.required": "missing required password field",
    })
    .min(1)
    .messages({
      "string.min": "password must be at least 1 characters long",
    }),

  birthDate: Joi.date(),
}).options({ abortEarly: false });

const loginJoiSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({
      "any.required": "missing required email field",
    })
    .pattern(emailRegexp)
    .messages({
      "string.pattern.base": "invalid email format",
    }),

  password: Joi.string()
    .required()
    .messages({
      "any.required": "missing required password field",
    })
    .min(1)
    .messages({
      "string.min": "password must be at least 1 characters long",
    }),
}).options({ abortEarly: false });

const emailJoiSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .messages({
      "string.pattern.base": "invalid email format",
    })
    .required()
    .messages({
      "any.required": "missing required email field",
    }),
});

const schemas = {
  registerJoiSchema,
  loginJoiSchema,
  emailJoiSchema,
};

module.exports = {
  User,
  schemas,
};
