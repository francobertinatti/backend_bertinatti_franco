const multer = require('multer')
const path = require('path')
const fs = require('fs').promises

const storage = multer.diskStorage({
    destination: async function(req,file,cb)
    {
        const {uid} = req.params;
        const fileType = file.fieldname === 'profile' ? 'profiles' : file.fieldname === 'product' ? 'products' : 'documents';
        const folderPath = path.join(__dirname, `../uploads/${fileType}/${uid}`)
        
        try {
            await fs.mkdir(folderPath, {recursive: true})
            cb(null, folderPath)
        } catch (error) {
            cb(error)
        }

    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname) //Quizas borrar el "Date.now() +"
    }
})

const uploader = multer({storage})

module.exports = uploader