const db = require('../models/index.model');

module.exports = async function (req, res, next) {
    if (req.signedCookies.accountId) {
        const node = await db.accounts.findById(req.signedCookies.accountId);
        if (node.role === 3) {
            const _id = await db.customerInfor.find({ _accountId: req.signedCookies.accountId }).populate('_accountId');
            if (_id[0]._accountId.role === 3) {
                const customerInfor = {
                    _id: _id[0]._id,
                    avatar: _id[0]._accountId.avatar,
                    displayname: _id[0].displayname,
                }
                res.locals.userSession = customerInfor;
            }
        }
    }
    res.locals.categoryTN = await db.categoryTour.find({ catagory: 1 });

    next();
};
