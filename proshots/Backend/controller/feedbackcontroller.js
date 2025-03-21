const feedbackmodel = require('../model/feedbackmodel');

exports.getfeedback = async(req, res,next) => { //--------------------------read all--------------------------------
    const feedback = await feedbackmodel.find()
    res.json({
        success: true,
        message: feedback
    })}
exports.getonefeedback = async(req, res,next) => { //--------------------------raed by id--------------------------------
    const feedback = await feedbackmodel.findById(req.params.id)
    if (!feedback) {    
        return res.json({
        success: false,
        message: 'No feedback found'
    });
    } else {
    return res.json({
        success: true,
        message: feedback
    })}}
exports.postfeedback = async(req, res) => { //--------------------------insert--------------------------------
    const feedback = await feedbackmodel.create(req.body);
    res.json({
        success: true,
        message:feedback
    })}
exports.updatefeedback = async(req, res) => { //--------------------------update by id--------------------------------
    const feedback = await feedbackmodel.findByIdAndUpdate(req
        .params.id, req.body, {
            new: true,
            runValidators: true
        });
    if (!feedback) {
        return res.json({
            success: false,
            message: 'No feedback found'
        });
    } else {
    return res.json({
        success: true,
        message: feedback
    })}}
exports.deletefeedback = async(req, res) => { //--------------------------delete by id--------------------------------
    const feedback = await feedbackmodel.findByIdAndDelete(req.params.id);
    if (!feedback) {
        return res.json({
            success: false,
            message: 'No feedback found'
        });
    } else {
    return res.json({
        success: true,
        message: feedback
    })}}
    exports.getonefeedback = async(req, res,next) => { //--------------------------raed by reporttype--------------------------------
        const feedback = await feedbackmodel.findOne({reporttype:req.params.reporttype})
        if (!feedback) {    
            return res.json({
            success: false,
            message: 'No feedback found'
        });
        } else {
        return res.json({
            success: true,
            message: feedback
        })}}