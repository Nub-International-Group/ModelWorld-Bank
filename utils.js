function pickProperties (obj, keys) {
  const filtered = {}

  for (const key of keys) {
    filtered[key] = obj[key]
  }

  return filtered
}

function generateParamMiddleware (Model, name) {
  return async (req, res, next) => {
    try {
      const doc = await Model.findOne({ _id: req.params[name + 'Id'] }).exec()

      if (!doc) {
        const e = new Error(`Resource (${name}) by id (${req.params[name + 'Id']}) not found.`)
        e.code = 404

        throw e
      }

      req[name] = doc
      next()
    } catch (e) {
      return next(e)
    }
  }
}

function generatePatchHandler (modelName, attributes) {
  return async (req, res, next) => {
    try {
      const filtered = pickProperties(req[modelName], attributes)

      if (!Object.keys(filtered).length) {
        return res.status(204).send(req[modelName])
      }

      const updated = await req[modelName].update(filtered).exec()
      res.status(200).json(updated)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = {
  generateParamMiddleware,
  generatePatchHandler
}
