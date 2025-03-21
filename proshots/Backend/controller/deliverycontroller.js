const deliverymodel = require('../model/deliverymodel');

exports.postdelivery = async(req, res,next) => { //--------------------------insert --------------------------------
    const delivery = await deliverymodel.create(req.body);
    res.json({
        succsess: true,
        message:delivery
    });
}
exports.getdelivery = async(req, res,next) => { //--------------------------read--------------------------------
    const delivery = await deliverymodel.find()
    res.json({
        succsess: true,
        message: delivery
    });
}
exports.getonedelivery = async(req, res,next) => {    //--------------------------read by id--------------------------------
    const delivery = await deliverymodel.findById(req.params.id)
    if (!req.params.id) {
        return res.json({
            success: false,
            message: 'No delivery found'
        });
    }      else {
    return res.json({
        success: true,
        message: delivery
    })}}
exports.updatedelivery = async(req, res,next) => { //--------------------------update by id--------------------------------
    const delivery = await deliverymodel.findByIdAndUpdate
    (req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!delivery) {
        return res.json({
            success: false,
            message: 'No delivery found'
        });
    }      else {
    return res.json({
        success: true,
        message: delivery
    })}}

exports.deletedelivery = async(req, res,next) => {    //--------------------------delete--------------------------------
    const delivery = await deliverymodel.findByIdAndDelete(req.params.id);
    if (!delivery) {
        return res.json({
            success: false,
            message: 'No delivery found'
        });
    }      else {
    return res.json({
        success: true,
        message: delivery
    })}}

    exports.getonedelivery = async(req, res,next) => {    //--------------------------read by id--------------------------------
        const delivery = await deliverymodel.findById(req.params.id)
        if (!req.params.id) {
            return res.json({
                success: false,
                message: 'No delivery found'
            });
        }      else {
        return res.json({
            success: true,
            message: delivery
        })}}
        exports.getdatedelivery = async(req, res,next) => {    //--------------------------read by date--------------------------------
            const delivery = await deliverymodel.findOne({date:req.params.date})
            if (!req.params.date){
                return res.json({
                    success: false,
                    message: 'No delivery found'
                });
            }      else {
            return res.json({
                success: true,
                message: delivery
            })}}
            exports.getdatedelivery = async(req, res,next) => {    //--------------------------read by prodect--------------------------------
                const delivery = await deliverymodel.findOne({date:req.params.prodect})
                if (!req.params.prodect){
                    return res.json({
                        success: false,
                        message: 'No delivery found'
                    });
                }      else {
                return res.json({
                    success: true,
                    message: delivery
                })}}
                exports.getdatedelivery = async(req, res,next) => {    //--------------------------read by date--------------------------------
                    const delivery = await deliverymodel.findOne({date:req.params.adress})
                    if (!req.params.adress){
                        return res.json({
                            success: false,
                            message: 'No delivery found'
                        });
                    }      else {
                    return res.json({
                        success: true,
                        message: delivery
                    })}}
                    exports.getdatedelivery = async(req, res,next) => {    //--------------------------read by date--------------------------------
                        const delivery = await deliverymodel.findOne({date:req.params.qyantity})
                        if (!req.params.qyantity){
                            return res.json({
                                success: false,
                                message: 'No delivery found'
                            });
                        }      else {
                        return res.json({
                            success: true,
                            message: delivery
                        })}}