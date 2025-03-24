const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add-admin', authMiddleware, adminController.addAdmin);
router.get('/admin-list', authMiddleware, adminController.getAdminList);
router.put('/edit-admin/:id', authMiddleware, adminController.editAdmin);
router.delete('/delete-admin/:id', authMiddleware, adminController.deleteAdmin);

module.exports = router;