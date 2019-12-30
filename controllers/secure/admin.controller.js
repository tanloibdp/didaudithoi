const mongoose = require('mongoose');

const db = require('../../models/index.model');
const handler = require('../../middlewares/handler');

/* GET admin page. */
module.exports.getAdmin = function (req, res, next) {
    res.render('secure/index', { user: req.body.user });
};

/* GET tours page. */
module.exports.getTour = async function (req, res, next) {
    const arrdanhmuc = ['Tên tour', 'Phương tiện', 'Khởi hành', 'Giá người lớn', 'Giá trẻ em', 'Tình trạng', 'Thao tác'];

    const tours = await db.tours.find().sort({ _id: 'ascending' });

    const tour = {
        arrdanhmuc: arrdanhmuc,
        user: req.body.user,
        tours: tours,
    };

    res.render('secure/tours/index', tour);
};

/* GET tour detail page. */
module.exports.getTourId = async function (req, res, next) {
    const tour = await db.tours.findById(req.params.tourId);
    var placeStart = await db.placeStart.find();
    const doccument = {
        user: req.body.user,
        tour: tour,
        placeStart: placeStart,
    };

    res.render('secure/tours/detail', doccument);
};

/* Post tour detail page. */
module.exports.postTourId = async function (req, res, next) {
    let tour = await db.tours.findById(req.params.tourId);
    let image = tour.image;
    let image2 = tour.image2;
    let image3 = tour.image3;
    let image4 = tour.image4;
    let image5 = tour.image5;
    if (typeof (req.files.imageTour) !== 'undefined') {
        image = req.files.imageTour[0].path.slice(6);
    };
    if (typeof (req.files.imageTour2) !== 'undefined') {
        image2 = req.files.imageTour2[0].path.slice(6);
    };
    if (typeof (req.files.imageTour3) !== 'undefined') {
        image3 = req.files.imageTour3[0].path.slice(6);
    };
    if (typeof (req.files.imageTour4) !== 'undefined') {
        image4 = req.files.imageTour4[0].path.slice(6);
    };
    if (typeof (req.files.imageTour5) !== 'undefined') {
        image5 = req.files.imageTour5[0].path.slice(6);
    };
    tour.nameTour = req.body.nameTour;
    tour.vehicle = req.body.vehicle;
    tour.dateStart = req.body.dateStart;
    tour.price = Number(req.body.price);
    tour._placeStart = req.body.placeStart;
    tour.priceChildren = Number(req.body.priceChildren);
    tour.image = image;
    tour.image2 = image2;
    tour.image3 = image3;
    tour.image4 = image4;
    tour.image5 = image5;
    tour.tickets = Number(req.body.tickets);
    tour.description = req.body.description;
    await tour.save();

    res.redirect(`/admin/tour/${tour._id}`);
};

/* Get tour additional page. */
module.exports.getAddTour = async function (req, res, next) {
    var placeStart = await db.placeStart.find();
    const doccument = {
        placeStart: placeStart,
        user: req.body.user,
        err: {
            imageTour: 'style="color: blue; font-size: 20px;"',
        },
        values: {

        }
    };
    res.render('secure/tours/additional', doccument);
};

module.exports.postAddTour = async function (req, res, next) {
    const _dt = new Date(req.body.dateStart);
    const formatD = [_dt.getDate(), (_dt.getMonth() + 1), _dt.getFullYear()].join('/');

    const image2 = req.files.imageTour2 ? req.files.imageTour2[0].path.slice(6) : '/images/imageTour/defaultImage.png';
    const image3 = req.files.imageTour3 ? req.files.imageTour3[0].path.slice(6) : '/images/imageTour/defaultImage.png';
    const image4 = req.files.imageTour4 ? req.files.imageTour4[0].path.slice(6) : '/images/imageTour/defaultImage.png';
    const image5 = req.files.imageTour5 ? req.files.imageTour5[0].path.slice(6) : '/images/imageTour/defaultImage.png';

    const newTour = new db.tours({
        _id: new mongoose.Types.ObjectId(),
        nameTour: req.body.nameTour,
        vehicle: req.body.vehicle,
        _placeStart: req.body.placeStart,
        dateStart: formatD,
        price: Number(req.body.price),
        priceChildren: Number(req.body.priceChildren),
        image: req.files.imageTour[0].path.slice(6),
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5,
        tickets: Number(req.body.tickets),
        status: 'Mở bán',
        description: req.body.description,
    });
    newTour.save();
    res.redirect('/admin/tour');
};

/* GET tour detail page. */
module.exports.deleteTourId = async function (req, res, next) {
    await db.tours.remove({ _id: req.params.tourId });
    res.redirect('/admin/tour');
};



/* GET tour category page. */
module.exports.getTourCg = async function (req, res, next) {
    let reqSelect = req.body.reqSelect ? req.body.reqSelect === '1' ? 1 : req.body.reqSelect === '2' ? 2 : 0 : 0;
    let catagoryTour = req.body.reqSelect ?
        req.body.reqSelect === 'default' ? await db.categoryTour.find().sort({ _id: 'ascending' }) :
            await db.categoryTour.find({ catagory: reqSelect }).sort({ _id: 'ascending' }) : await db.categoryTour.find().sort({ _id: 'ascending' });
    const arrdanhmuc = ['Khu vực', 'Thao tác'];
    const select = ['Loại tour trong nước', 'Loại tour nước ngoài'];
    const doccument = {
        select: select,
        reqSelect: reqSelect,
        arrdanhmuc: arrdanhmuc,
        user: req.body.user,
        catagoryTour: catagoryTour.map(doc => {
            return {
                _id: doc._id,
                catagory: doc.catagory === 1 ? 'Loại tour trong nước' : 'Loại tour nước ngoài',
                zone: doc.zone,
            };
        }),
    };

    res.render('secure/categorytour/index', doccument);
};

/* GET tour category additional page. */
module.exports.getNewTourCg = function (req, res, next) {
    const doccument = {
        user: req.body.user,
    };
    res.render('secure/categorytour/additional', doccument);
};

/* POST tour category additional page. */
module.exports.postNewTourCg = function (req, res, next) {
    const newCategoryTour = new db.categoryTour({
        _id: handler.hash(req.body.zone).toLowerCase(),
        catagory: Number(req.body.categorytour),
        zone: req.body.zone,
    });

    newCategoryTour.save();
    res.redirect('/admin/categorytour');
};

/* GET tour category detail page. */
module.exports.getTourCgId = async function (req, res, next) {
    const arrdanhmuc = ['Tên Tour', 'Loại du lịch', 'Khu vực', 'Thao tác'];
    const categoryTour = await db.categoryTour.findById(req.params.categoryTourId);
    console.log(categoryTour);
    const joincategoryTour = await db.joinCategoryTour.find({ _categoryId: req.params.categoryTourId }).populate('_categoryId _tourId');
    const mapJoinCT = joincategoryTour.map(doc => {
        return {
            _id: doc._id,
            _tourId: doc._tourId._id,
            nameTour: doc._tourId.nameTour,
            catagory: doc._categoryId.catagory === 1 ? 'Tour trong nước' : 'Tour nước ngoài',
            zone: doc._categoryId.zone,
        }
    });
    var filltertour = [];
    if ((joincategoryTour === undefined || joincategoryTour.length === 0)) {
        filltertour = await db.tours.find();
    } else {
        let tours = await db.tours.find();
        tours.forEach(element => {
            let dem = 0;
            mapJoinCT.forEach(item => {
                if (String(element._id) === String(item._tourId)) {
                    dem++;
                }
            });
            if (dem === 0) {
                filltertour.push(element);
            }
        });
    }

    const doccument = {
        tours: filltertour.map(doc => { return { _id: doc._id, nameTour: doc.nameTour, } }),
        arrdanhmuc: arrdanhmuc,
        categoryTour: categoryTour,
        joincategoryTour: mapJoinCT,
        user: req.body.user,
    };
    res.render('secure/categorytour/detail', doccument);
};

/* POST tour category detail page. */
module.exports.postTourCgId = function (req, res, next) {
    const joinCatagoryTour = new db.joinCategoryTour({
        _id: new mongoose.Types.ObjectId(),
        _categoryId: req.params.categoryTourId,
        _tourId: req.body.tourId,
        description: req.body.description || '',
    });
    joinCatagoryTour.save();
    res.redirect(`/admin/categorytour/${req.params.categoryTourId}`);
};

/* Delete tour category detail page. */
module.exports.DeleteTourCgId = async function (req, res, next) {
    await db.joinCategoryTour.remove({ _categoryId: req.params.categoryTourId });
    await db.categoryTour.remove({ _id: req.params.categoryTourId });
    res.redirect('/admin/categorytour');
};

/* Delete tour category detail page. */
module.exports.DeleteJoinTourCgId = async function (req, res, next) {
    await db.joinCategoryTour.remove({ _id: req.params.joincategorytour });
    res.redirect(`/admin/categorytour/${req.query.query}`);
};

/* GET Place Start page. */
module.exports.getPlaceStart = async function (req, res, next) {
    var arrdanhmuc = ['Địa điểm khởi hành', 'Mô tả', 'Thao tác'];
    var placeStart = await db.placeStart.find().sort({ _id: 'ascending' });
    const doccument = {
        arrdanhmuc: arrdanhmuc,
        user: req.body.user,
        placeStart: placeStart,
    };
    res.render('secure/placeStart/index', doccument);
};

/* Add Place Start page. */
module.exports.postNewPlaceStart = async function (req, res, next) {
    const newPlaceStart = new db.placeStart({
        _id: handler.hash(req.body.placeStart).toLowerCase(),
        placeStart: req.body.placeStart,
        description: req.body.description
    });
    newPlaceStart.save();
    res.redirect('/admin/placeStart');
};


/* Delete Place Start page. */
module.exports.DeletePlaceStart = async function (req, res, next) {
    await db.placeStart.remove({ _id: req.params.placeStartId });
    res.redirect('/admin/placeStart');
};

/* GET Booked page. */
module.exports.getBooked = async function (req, res, next) {
    var arrdanhmuc = ['Tên Khách Hàng', 'Tên Tour', 'Vé người lớn', 'Vé trẻ em', 'Số điện thoại', 'Thời gian đặt', 'Trạng thái', 'Thao tác'];
    var arrTT = ['Đã Hủy', 'Đang xử lý...', 'Đã xác nhận', 'Đã Đặt'];
    const booked = await db.booking.find().populate('_tourId _customerId').sort({ dateBook: 'descending' });
    function DateFormat(params) {
        var Re = `${params.getDate()}/${params.getMonth() + 1}/${params.getFullYear()} ${params.getHours()}:${params.getMinutes()}:${params.getSeconds()} `
        return Re;
    }
    const doccument = {
        user: req.body.user,
        arrdanhmuc: arrdanhmuc,
        arrTT: arrTT,
        booked: booked.map(doc => {
            return {
                _id: doc._id,
                displayname: doc._customerId.displayname,
                nameTour: doc._tourId.nameTour,
                Ntickets: doc.Ntickets,
                NCtickets: doc.NCtickets,
                numberPhone: doc._customerId.numberPhone,
                dateBook: DateFormat(doc.dateBook),
                status: doc.status,
            };
        }),
    };
    res.render('secure/booked/index', doccument);
};

/* POST Booked page. */
module.exports.postBooked = async function (req, res, next) {
    const booked = await db.booking.findById({ _id: req.params.bookedId });
    booked.status = req.body.reqSelect;
    booked.save();
    res.redirect('/admin/booked');
};



