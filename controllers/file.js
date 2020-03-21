const File = require('../models/file');
const path = require('path');
const fs = require('fs');


exports.upload_files = async (req, res) => {
    try {
        const files = req.files.map(item => ({...item, extension: path.extname(item.originalname)}));
        if (!files.length) {
            res.status(400).json({message: 'Вложение не может быть пустым'});
        }
        await File.bulkCreate(files);
        res.status(201).json(files);
    } catch (e) {
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
        res.status(200).json(response.rows);
    } catch (e) {
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
        res.status(500).json({message: 'Server error'});
    }
};
exports.update_file = async (req, res) => {
    try {
        let oldFile = await File.findByPk(+req.params.id);
        const newFile = req.file;
        newFile.extension = path.extname(newFile.originalname);
        if(!oldFile) {
            res.status(404).json({message: 'Файл не найден'});
            return
        }
        await fs.unlink(oldFile.path, async (err) => {
            if (err) throw err;
            oldFile.fieldname = newFile.fieldname;
            oldFile.originalname = newFile.originalname;
            oldFile.encoding = newFile.encoding;
            oldFile.mimetype = newFile.mimetype;
            oldFile.destination = newFile.destination;
            oldFile.path = newFile.path;
            oldFile.filename = newFile.filename;
            oldFile.size = newFile.size;
            oldFile.extension = newFile.extension;
            await oldFile.save();
            res.status(200).json(oldFile);
        });
    } catch (e) {
        res.status(500).json({message: 'Server error'});
    }
};
