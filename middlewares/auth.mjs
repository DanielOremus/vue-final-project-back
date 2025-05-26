import UserManager from "../api/v1/models/user/UserManager.mjs"
import JWTHelper from "../utils/JWTHelper.mjs"

async function getUserFromRequest(req) {
  try {
    const bearer = req.headers.authorization
    const token = JWTHelper.parseBearer(bearer, req.headers)
    return await UserManager.getOne({ email: token.email }, null, ["role"])
  } catch (error) {
    throw new Error("Error while parsing token")
  }
}

export const getPermissionChecker =
  (model) => (requiredPermission) => async (req, res, next) => {
    try {
      req.user = await getUserFromRequest(req)
      if (!req.user?.role.permissions[model][requiredPermission])
        return res.status(403).json({ success: false, msg: "Forbidden" })
      next()
    } catch (error) {
      res.status(401).json({ success: false, msg: "Unauthorized" })
    }
  }

export const ensureAuthenticated = async (req, res, next) => {
  try {
    req.user = await getUserFromRequest(req)
    next()
  } catch (error) {
    res.status(401).json({ success: false, msg: "Unauthorized" })
  }
}
