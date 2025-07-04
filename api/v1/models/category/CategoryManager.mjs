import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import Category from "./Category.mjs"
import { config } from "../../../../config/default.mjs"

class CategoryManager extends MongooseCRUDManager {
  buildPipeline(filters, options, lang, localizedFields) {
    const pipeline = []
    //Apply filters
    // if (Object.keys(filters).length) pipeline.push({ $match: filters })

    const projectionFields = {}

    if (localizedFields.length) {
      //Adding localized temp fields
      const tempFields = {}
      for (const field of localizedFields) {
        tempFields[`localized_${field}`] = {
          $ifNull: [`$${field}.${lang}`, `$${field}.${config.fallbackLocale}`],
        }
      }
      pipeline.push({ $addFields: tempFields })
      //Replacing main fields with temp localized fields
      for (const field of localizedFields) {
        projectionFields[field] = `$localized_${field}`
        projectionFields.value = `$value`
      }
    }
    //Adding fields to pipeline
    if (Object.keys(projectionFields).length)
      pipeline.push({ $project: projectionFields })

    //Adding options
    // actions.forEach((actionObj) => {
    //   switch (actionObj.type) {
    //     case "sort":
    //       pipeline.push({ $sort: { [actionObj.field]: actionObj.order } })
    //       break
    //     case "skip":
    //       pipeline.push({ $skip: actionObj.value })
    //       break
    //     case "limit":
    //       pipeline.push({ $limit: actionObj.value })
    //       break
    //     default:
    //       console.log(`Unsupported action type: ${actionObj.type}`)
    //       break
    //   }
    // })
    return pipeline
  }
  async getList(filters, options, lang, localizedFields = []) {
    try {
      const pipeline = this.buildPipeline(
        filters,
        options,
        lang,
        localizedFields
      )
      const documents = await this.model.aggregate(pipeline)

      return { documents, count: documents.length }
    } catch (error) {
      console.log("Error while getting data: " + error.message)

      return { documents: [], count: 0 }
    }
  }
}

export default new CategoryManager(Category)
