const generateParamMiddleware = (Model, name) => {
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

module.exports = {
  generateParamMiddleware
}
