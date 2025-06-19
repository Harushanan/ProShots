const mongoose = require('mongoose');
const packageModel = require('../../models/Package');

const deletePackage = async(req, res) => {
    const pkgID = req.params.id;

    try {
        const deletedPkg = await packageModel.findByIdAndDelete(pkgID);

        if( !deletedPkg ) {
            res.status(400).json({success:false, message:"Invalid package id."});
        }
        res.status(200).json({ success: true, message: "Package deleted successfully" });

    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ success: false, message: "Server error while deleting package" });
    }

}

module.exports = deletePackage;