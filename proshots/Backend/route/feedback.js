const express = require('express');
const router = express.Router();
const { getfeedback, postfeedback, getonefeedback, updatefeedback ,deletefeedback } = require('../controller/feedbackcontroller');

router.route('/feedback').get(getfeedback)
router.route('/feedback').post(postfeedback)
router.route('/feedback/:date').get(getonefeedback)
router.route('/feedback/:id').put(updatefeedback)
router.route('/feedback/:id').delete(deletefeedback)

module.exports = router;
