const express = require('express')
const memberCtl = require('../controllers/members.controllers')
const router = express.Router()

router.get('/', memberCtl.getMembers)
router.post('/signup', memberCtl.addMember)
router.get('/activate', memberCtl.activateMember)

module.exports = router