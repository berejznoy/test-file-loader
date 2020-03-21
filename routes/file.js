const {Router} = require('express');
const multer  = require('multer');
const crypto  = require('crypto');
const path = require('path');
const router = Router();
const file = require('../controllers/file');

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

/**
 * Загрузка файлов
 */
router.post('/file/upload', upload.array('documents', 6), file.upload_files);

/**
 * Обновление файла
 */
router.put('/file/update/:id', upload.single('documents'), file.update_file);

/**
 * Получить список всех файлов
 */
router.get('/file/list', file.get_files);

/**
 * Получить инфо по конкретному файлу
 */
router.get('/file/:id', file.get_file);

/**
 * Удалить фаил
 */
router.delete('/file/delete/:id', file.delete_file);

/**
 * Загрузить файл
 */
router.get('/file/download/:id', file.download_file);


module.exports = router;
