import sharp from "sharp"

class ImageManager {
  static optimizeImgWidth = 300
  static fileToBase64(fileData) {
    return `data:${fileData.mimetype};base64,${fileData.buffer.toString(
      "base64"
    )}`
  }
  static async reduceFileSize(fileBuffer) {
    return await sharp(fileBuffer)
      .resize(ImageManager.optimizeImgWidth)
      .toBuffer()
  }
  static async getOptimizedImg(fileData) {
    const optimizedBuffer = await ImageManager.reduceFileSize(fileData.buffer)
    return ImageManager.fileToBase64({
      mimetype: fileData.mimetype,
      buffer: optimizedBuffer,
    })
  }
}

export default ImageManager
