const express = require('express')
const memberCtl = require('../controllers/members.controllers')
const router = express.Router()

router.get('/', memberCtl.showProperty)
router.post('/bookmark', memberCtl.addBookmark)

module.exports = router