const multer = require('multer');

//On recupere nos mine type de nos fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//On enregistre dans le dossier images 
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'images');
  },
  filename: (request, file, callback) => {
    //On genere un nom pour notre image
    const name = file.originalname.split(' ').join('_');
    //On genere une extention pour nos images
    const extension = MIME_TYPES[file.mimetype];
    //On assemble le nom et lextention de nos images
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');