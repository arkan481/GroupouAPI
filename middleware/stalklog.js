module.exports = function (req, res, next) {
    const identifier = req.params.identifier;
    console.log(`${req.user._id} requested to search user : ${identifier}`);
    next();
}