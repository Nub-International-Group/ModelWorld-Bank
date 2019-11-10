const generateParamMiddleware = (Model, name) => {
  return async (req, res, next) => {
    try {
      const doc = await Model.findOne({ _id: req.params[name + 'Id'] }).exec()

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
