const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {

        // Determine the folder based on file properties or request data
        let folder;
        let trasformConfig = {};
        if (file.fieldname === 'avatar') {
            folder = 'avatars';
            // transform image to 100X100 with face detection gravity
            trasformConfig = {width: 100, height: 100, gravity: "face", crop: "thumb"}
        }
         else if (file.fieldname === "cocktail") {
            folder = "cocktails";
        } else {
            folder = "others";
        }

        const fileName =  file.originalname.split('.')[0];
        return {
            folder: folder,
            allowed_formats: ["jpg", "png"], // Adjust the allowed formats as needed
            public_id: fileName + Date.now(), // Use original filename as the public ID
            transformation: [
                trasformConfig
            ],
        };
    },
});

// upload.fields([
//     {name: 'avatar', maxCount: 1}, {name: 'subcover', maxCount: 2})]
// upload.array('avatar', 9)

const upload = multer({ storage });

module.exports = upload;


