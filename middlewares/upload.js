const multer = require('multer');
const path = require('path');

const tempDir = path.join(__dirname, '../', 'temp');

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: multerConfig});


// upload.fields([
//     {name: 'avatar', maxCount: 1}, {name: 'subcover', maxCount: 2})]
// upload.array('avatar', 9)

module.exports = upload;
