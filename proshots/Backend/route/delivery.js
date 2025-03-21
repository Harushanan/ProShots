const express = require('express');
const router = express.Router();
const { getdelivery, postdelivery,getonedelivery, updatedelivery ,deletedelivery, getdatedelivery } = require('../controller/deliverycontroller');

router.route('/delivery').get(getdelivery)
router.route('/delivery').post(postdelivery)
router.route('/delivery/:date').get(getdatedelivery)
router.route('/delivery/:id').get(getonedelivery)
router.route('/delivery/:id').put(updatedelivery)
router.route('/delivery/:id').delete(deletedelivery)


module.exports = router;