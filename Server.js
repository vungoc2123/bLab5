const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');
var fs = require('fs');
const path = require('path');
const { MulterError } = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))


const ChangeFileName = (filename,ext) => {
    arr = filename.split('.');
    let newFileName = '';
    for (var i = 0; i < arr.length; i++) {
        if (i != arr.length - 1) {
            newFileName += arr[i];
        } else {
            newFileName += ('-' + Date.now() + ext);
        }
    }
    return newFileName
}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        var tenGoc = file.originalname;
        cb(null,ChangeFileName(tenGoc,ext))
    },
})
// SET STORAGE
var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var tenGoc = file.originalname;
        var ext = path.extname(file.originalname);
        if(ext == '.png' || ext == '.jpg' || ext == '.gif'|| ext == '.jpeg' || ext =='.jfif') {
            var tenGoc = file.originalname;
            cb(null,ChangeFileName(tenGoc,".jpeg"))
        }else{
            cb("Chỉ được gửi những file ảnh")
        }
    },
})

var upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > 1024 * 1024) {
            return callback("Kích thước file lớn hơn 1MB");
        } else {
            return callback(null, true);
        }

    }
})
var upload2 = multer({
    storage: storage2,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > 1024 * 1024) {
            return callback("Kích thước file lớn hơn 1MB");
        } else {
            return callback(null, true);
        }

    }
})


app.post('/uploadfile', upload.single('myFile'), (req, res, err) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return err(error)
    }
    res.send(file)
})


//Uploading multiple files
app.post('/uploadmultiple', upload2.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});