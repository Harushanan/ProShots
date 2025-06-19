 const EventBookingModel = require("../../models/EventBookingModel");
 
 
 const deleteMyBooking = async(req, res) => {
     const {id} = req.params;
     try {
         const deleteEvent = await EventBookingModel.findByIdAndDelete(id);
         
         if (!deleteEvent) {
             return res.status(404).json({
                 success: false,
                 message: 'Event not found'
             });
         }
 
         res.status(200).json({
             success: true,
             message: 'Deleted successfully',
             data: deleteEvent 
         })
 
     } catch (error) {
         console.log(error);
         res.status(500).json({
             success: false,
             message: 'Error delete booking'
         })
     }
 }
 
 module.exports = deleteMyBooking;
 