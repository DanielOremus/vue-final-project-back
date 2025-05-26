import mongoose from "mongoose"
import QueryParser from "./QueryParser.mjs"

class SelectionHelper {
  static applyFilters(query, filters) {
    for (const filterObj of filters) {
      switch (filterObj.filterType) {
        case "minValue":
          query.where(filterObj.fieldName).gte(filterObj.filterValue)
          break
        case "maxValue":
          query.where(filterObj.fieldName).lte(filterObj.filterValue)
          break
        case "in":
          query.where(filterObj.fieldName).in(filterObj.filterValue)
          break
        case "search":
          query
            .where(filterObj.fieldName)
            .regex(new RegExp(filterObj.filterValue, "i"))
          break
        default:
          console.log(`Unsupported filterType: ${filterObj.filterType}`)
      }
    }
    //!!BACKUP
    // filters.forEach((filterObj) => {
    //   switch (filterObj.filterType) {
    //     case "minValue":
    //       query.where(filterObj.fieldName).gte(filterObj.filterValue)
    //       break
    //     case "maxValue":
    //       query.where(filterObj.fieldName).lte(filterObj.filterValue)
    //       break
    //     case "in":
    //       query.where(filterObj.fieldName).in(filterObj.filterValue)
    //       break
    //     case "search":
    //       query
    //         .where(filterObj.fieldName)
    //         .regex(new RegExp(filterObj.filterValue, "i"))
    //       break
    //     default:
    //       console.log(`Unsupported filterType: ${filterObj.filterType}`)
    //   }
    // })

    return query
  }
  static applyActions(query, actions) {
    actions.forEach((actionObj) => {
      switch (actionObj.type) {
        case "sort":
          query.sort({ [actionObj.field]: actionObj.order })
          break
        case "skip":
          query.skip(actionObj.value)
          break
        case "limit":
          query.limit(actionObj.value)
          break
        default:
          console.log(`Unsupported action type: ${actionObj.type}`)
          break
      }
    })
    return query
  }
  static applySelection(reqQuery, fieldsConfig, query) {
    const { actions, filters } = QueryParser.parse(reqQuery, fieldsConfig)
    if (filters.length) query = this.applyFilters(query, filters)
    if (actions.length) query = this.applyActions(query, actions)
    return query
  }
  static async applyFiltersSelection(reqQuery, fieldsConfig, query) {
    const filters = QueryParser.parseFilters(reqQuery, fieldsConfig)
    console.log("filters-----------------")

    console.log(filters)

    for (const filterObj of filters) {
      if (filterObj.filterType === "in" && filterObj.refModel) {
        const docs = await mongoose
          .model(filterObj.refModel)
          .find({ [filterObj.matchField]: { $in: filterObj.filterValue } })
          .lean()
        filterObj.filterValue = docs.map((doc) => doc._id.toString())
      }
    }

    if (filters.length) query = this.applyFilters(query, filters)
    return { query }
  }
  static applyActionsSelection(reqQuery, query) {
    const actions = QueryParser.parseActions(reqQuery)
    console.log("actions-----------------")

    console.log(actions)
    if (actions.length) query = this.applyActions(query, actions)
    return query
  }
}

export default SelectionHelper
