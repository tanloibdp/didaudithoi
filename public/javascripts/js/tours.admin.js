const btnsub = document.getElementById('btnsub');

const inputfile = document.getElementById('inputfile');

btnsub.click(function () {
    if (parseInt(inputfile.get(0).files.length) > 2) {
        alert("You can only upload a maximum of 2 files");
    }
});