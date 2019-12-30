const tbodyId = document.getElementById('tbodyId');
const searchId = document.getElementById('searchId');
const cbDangban = document.getElementById('cbDangban');
const cbTamdung = document.getElementById('cbTamdung');
const cbDahuy = document.getElementById('cbDahuy');

const urlJson = '/api/tour';

cbDangban.checked = true;
cbTamdung.checked = true;

filter();

searchId.addEventListener('keyup', filter);
cbDangban.addEventListener('click', filter);
cbTamdung.addEventListener('click', filter);
cbDahuy.addEventListener('click', filter);

function filter(event) {
    const cbdb = cbDangban.checked ? 'Mở bán' : '';
    const cbtd = cbTamdung.checked ? 'Dừng bán' : '';
    const cbdh = cbDahuy.checked ? 'Đã hủy' : '';
    var value = searchId.value;
    loadax(urlJson).then(function (data) {
        var stemp = data.tours.filter(function (item) {
            return xoa_dau(item.tenTour).toLowerCase().indexOf(xoa_dau(value).toLowerCase()) > -1
                && ((item.tinhtrang === cbdb) || (item.tinhtrang === cbtd) || (item.tinhtrang === cbdh));
        });
        render(stemp);
    });
}



function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

function loadax(parmater) {
    return new Promise(function (resolve, reject) {
        axios.get(parmater)
            .then(function (res) {
                resolve(res.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

function loadValue() {
    loadax(urlJson).then(function (data) {
        render(data.tours);
    });
}

function render(data) {
    var content = data.map(item => {
        let tinhtrang = '';
        if ('Mở bán' === item.tinhtrang) {
            tinhtrang = '<td>' +
                '<div class="d-inline-flex text-white">' +
                '<div class="p-2 bg-success">' + item.tinhtrang + '</div>' +
                '</div>' +
                '</td>';
        } else {
            tinhtrang = '<td>' +
                '<div class="d-inline-flex text-white">' +
                '<div class="p-2 bg-danger">' + item.tinhtrang + '</div>' +
                '</div>' +
                '</td>';
        }
        const maTour = String(item._id).substr(-4, 4);
        return '<tr>' +
            '<td>' + maTour + '</td>' +
            '<td>' + item.tenTour + '</td>' +
            '<td>' + item.phuongtien + '</td>' +
            '<td>' + item.khoihanh + '</td>' +
            '<td>' + item.gia + 'Đ' + '</td>' +
            '<td>' + item.daban + '</td>' +
            '<td>' + item.canban + '</td>' +
            tinhtrang +
            '<td>' +
            '<a href="#">' +
            '<button type="button" class="btn btn-primary"> Đặt Tour </button>' +
            '</a>' +
            '</td>' +
            '</tr>'
    });
    tbodyId.innerHTML = content.join(' ');
}

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

console.log(getParameterByName('page'));
