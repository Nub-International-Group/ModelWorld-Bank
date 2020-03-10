const router = (require('express')).Router()

const SettingCollection = require('../../models/setting-collection.js')

const middleware = require('../../middleware')

const getCurrent = async (req, res, next) => {
  try {
    const currentSettings = await SettingCollection.getCurrent()

    res.status(200).json(currentSettings)
  } catch (err) {
    next(err)
  }
}

const updateCurrent = async (req, res, next) => {
  try {
    await SettingCollection.updateCurrent(req.body)
  } catch (err) {
    next(err)
  }
}

const resetCurrent = async (req, res, next) => {
  try {
    await SettingCollection.resetCurrent()
  } catch (err) {
    next(err)
  }
}

router.get('/', getCurrent)
router.put('/', middleware.ensureAdmin, updateCurrent)
router.delete('/', middleware.ensureAdmin, resetCurrent)

module.exports = {
  router
}
