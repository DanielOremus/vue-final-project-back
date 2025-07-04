import mongoose from "mongoose"

export const checkIdFormat = (idFieldName, targetObj) => (req, res, next) => {
  const id = req[targetObj][idFieldName]
  if (!id) {
    return res
      .status(400)
      .json({ success: false, msg: `'${idFieldName}' must be provided` })
  }
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .json({ success: false, msg: "Provided id is invalid" })
  next()
}
