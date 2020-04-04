import { Handler } from 'express'
import createHttpError = require('http-errors')

export const pickProperties = (obj: any, keys: string[]) => {
  const filtered: {[key: string]: any} = {}

  for (const key of keys) {
    filtered[key] = obj[key]
  }

  return filtered
}

export const generateParamMiddleware = (Model: any, name: string): Handler => {
  return async (req, res, next) => {
    try {
      const doc = await Model.findOne({ _id: req.params[name + 'Id'] }).exec()

      if (!doc) {
        throw createHttpError(404, `Resource (${name}) by id (${req.params[name + 'Id']}) not found.`)
      }

      req[name] = doc
      next()
    } catch (e) {
      return next(e)
    }
  }
}

export const generatePatchHandler = (modelName: string, attributes: string[]): Handler => {
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
