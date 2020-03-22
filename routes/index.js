const {Router} = require('express');
const multer  = require('multer');
const crypto  = require('crypto');
const path = require('path');
const router = Router();
const file = require('../controllers/file');
const user = require('../controllers/auth');
const auth = require('../middleware/auth');
const { check, oneOf } = require('express-validator');

const validation = [
    oneOf([
        check('id')
            .exists()
            .withMessage('Обязательное поле')
            .isEmail()
            .withMessage('Введите номер телефона или email'),

        check('id')
            .exists()
            .withMessage('Поле обязательно')
            .isMobilePhone('ru-RU')
            .withMessage('Введите номер телефона или email')
    ]),
    check('password')
        .exists()
        .withMessage('Обязательное поле')
];

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});

const upload = multer({ storage: storage });

//Эндпоиноты для файлов
router.post('/file/upload', auth, upload.array('documents', 6), file.upload_files);
router.put('/file/update/:id', auth, upload.single('documents'), file.update_file);
router.get('/file/list', auth, file.get_files);
router.get('/file/:id', auth, file.get_file);
router.delete('/file/delete/:id', auth, file.delete_file);
router.get('/file/download/:id', auth, file.download_file);

//Эндпоинты для авторизации и регистрации
router.post('/signin', user.authorization);
router.post('/new_token', user.refreshToken);
router.get('/info', auth, user.user_info);
router.get('/logout', auth, user.user_logout);
router.post('/signup', validation, user.user_signup);


module.exports = router;
