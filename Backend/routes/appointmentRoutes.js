const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateConsultantToken, authenticateUserToken, authenticateOrganization, authenticateMultipleRoles } = require('../middleware/authMiddleware');

// CRUD Routes
router.post('/create', appointmentController.createAppointment);//
router.patch('/:appointmentId/status', appointmentController.updateAppointmentStatus);//
router.get('/doctor', appointmentController.getDoctorAppointments);//
router.get('/user/:email', appointmentController.getUserAppointments);//
router.get('/all', appointmentController.getAppointmentsByEmail);//
// router.get('/:id', appointmentController.getAppointment);
// router.delete('/delete/:id', appointmentController.deleteAppointment);


// Route for consultant appointments
// router.get('/consultant', appointmentController.getConsultantAppointments);
// Route to update appointment status
// router.patch('/:appointmentId/status', appointmentController.updateAppointmentStatus);//


module.exports = router;