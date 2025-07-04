import UserManager from "../models/user/UserManager.mjs"

class AuthValidator {
  static registerSchema = {
    username: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Username is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 20,
        },
        errorMessage: "Username must be between 3 and 30 chars",
      },
    },
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Email is required",
        bail: true,
      },
      isEmail: {
        errorMessage: "Invalid email format",
        bail: true,
      },
      custom: {
        options: async (value) => {
          const alreadyInUse = await UserManager.getOne({
            email: value.toLowerCase(),
          })

          if (alreadyInUse) {
            throw new Error("This email is already in use")
          }
          return true
        },
      },
    },
    password: {
      notEmpty: {
        errorMessage: "Password is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 50,
        },
        errorMessage: "Password must be between 3 and 50 chars",
      },
    },
  }
  static loginSchema = {
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Email is required",
      },
      isEmail: {
        errorMessage: "Invalid email format",
        bail: true,
      },
    },
    password: {
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
  }
}

export default AuthValidator
