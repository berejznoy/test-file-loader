const File = require('../models/file');
const path = require('path');
const fs = require('fs');
const log = require('../utils/log')(module);


exports.upload_files = async (req, res) => {
    try {
        const files = req.files.map(item => ({...item, extension: path.extname(item.originalname)}));
        if (!files.length) {
            res.status(400).json({message: 'Вложение не может быть пустым'});
        }
        await File.bulkCreate(files);
        res.status(201).json(files);
    } catch (e) {
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: 'Server error'});
    }
};
exports.get_files = async (req, res) => {
    try {
        const { page = 1, list_size = 10 } = req.params;
        const offset = page && page === 1 ? 0 : list_size * page - list_size;
        const response = await File.findAndCountAll({
            limit: list_size,
            offset
        });
        res.status(200).json({rows: response.rows, pages: Math.ceil(response.count / page), countPerPage: list_size});
    } catch (e) {
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: 'Server error'});
    }
};
exports.get_file = async (req, res) => {
    try {
        const response = await File.findByPk(+req.params.id);
        if(!response) {
            res.status(404).json({message: 'Файл не найден'});
            return
        }
        res.status(200).json(response);
    } catch (e) {
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: 'Server error'});
    }
};
exports.delete_file = async (req, res) => {
    try {
        const response = await File.findByPk(+req.params.id);
        if(!response) {
            res.status(404).json({message: 'Файл не найден'});
            return
        }
        await fs.unlink(response.dataValues.path, async (err) => {
            if (err) throw err;
            await response.destroy();
            res.status(200).json(response);
        });
    } catch (e) {
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: 'Server error'});
    }
};
exports.download_file = async (req, res) => {
    try {
        const response = await File.findOne({ where: {
                id: req.params.id
            }
        });
        if(!response) {
            res.status(404).json({message: 'Файл не найден'});
            return
        }
        const file = `${response.path}`;
        res.status(200).download(file);
    } catch (e) {
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: 'Server error'});
    }
};
exports.update_file = async (req, res) => {
    try {
        let file = await File.findByPk(+req.params.id);
        if(!file) {
            res.status(404).json({message: 'Файл не найден'});
            return
        }
        await fs.unlink(file.path, async (err) => {
            if (err) throw err;
            file.fieldname = req.file.fieldname;
            file.originalname = req.file.originalname;
            file.encoding = req.file.encoding;
            file.mimetype = req.file.mimetype;
            file.destination = req.file.destination;
            file.path = req.file.path;
            file.filename = req.file.filename;
            file.size = req.file.size;
            file.extension = path.extname(req.file.originalname);
            await file.save();
            res.status(200).json(file);
        });
    } catch (e) {
        log.error('Internal error(%d): %s',res.statusCode,e.message);
        res.status(500).json({message: 'Server error'});
    }
};
