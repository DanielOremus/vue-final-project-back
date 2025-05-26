class QueryParser {
  static range(fieldName, fieldValue) {
    let minValue, maxValue

    if (fieldValue.includes("-")) {
      ;[minValue, maxValue] = fieldValue.split("-").map((el) => parseFloat(el))
    } else {
      if (!Array.isArray(fieldValue)) {
        fieldValue = [fieldValue]
      }

      fieldValue.forEach((el) => {
        if (el.startsWith("gte:")) minValue = parseFloat(el.slice(4))
        if (el.startsWith("lte:")) maxValue = parseFloat(el.slice(4))
      })
    }

    const range = []

    if (isFinite(minValue)) {
      range.push({
        fieldName,
        filterType: "minValue",
        filterValue: minValue,
      })
    }
    if (isFinite(maxValue)) {
      range.push({
        fieldName,
        filterType: "maxValue",
        filterValue: maxValue,
      })
    }

    return range
  }
  static list(fieldName, fieldValue, refModel, matchField) {
    return [
      {
        fieldName,
        filterType: "in",
        filterValue: fieldValue.split(","),
        refModel,
        matchField,
      },
    ]
  }
  static search(fieldName, fieldValue) {
    return [
      {
        fieldName,
        filterType: "search",
        filterValue: fieldValue,
      },
    ]
  }

  static parseFilters(query, fieldsConfig = []) {
    const filters = []

    fieldsConfig.forEach(
      ({ fieldName, filterCategory, refModel, matchField }) => {
        if (query[fieldName]) {
          filters.push(
            ...this[filterCategory](
              fieldName,
              query[fieldName],
              refModel,
              matchField
            )
          )
        }
      }
    )

    return filters
  }
  static parseActions(query) {
    const actions = []
    if (query.sort) {
      const [field, order] = query.sort.split(":")
      actions.push({ type: "sort", field, order: order === "desc" ? -1 : 1 })
    }
    if (query.page >= 0 && query.perPage > 0) {
      actions.push({
        type: "skip",
        value: parseInt(query.page * query.perPage),
      })
      actions.push({ type: "limit", value: parseInt(query.perPage) })
    }
    return actions
  }
  static parse(query, fieldsConfig) {
    const actions = this.parseActions(query)
    const filters = this.parseFilters(query, fieldsConfig)
    return { actions, filters }
  }
}

export default QueryParser
