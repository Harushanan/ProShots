const getPackages = require('../../models/Package');


const getAllPackages = async(req, res) => {
    try {
        const AllPackages = await getPackages.find();

        res.status(200).json({
            success: true,
            data: AllPackages
        })
    } catch (error) { 
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occured wile fetching."
        })
    }
}

module.exports = getAllPackages;
