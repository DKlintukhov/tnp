const express = require('express');
const router = express.Router();

const controller = require('../controllers/Month.controller');

router.get('/month/:product', controller.getMonth);
router.put('/month/:product', controller.addNewMonth)
router.put('/day/:product', controller.updateDay);
router.post('/day/:product', controller.addWorkDay);
router.delete('/day/:product', controller.deleteWorkDay);
router.put('/ppr/:product', controller.updatePpr);
router.put('/days/:product', controller.updateDays);
router.put('/plan/:product', controller.updatePlan);

module.exports = router;