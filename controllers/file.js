const File = require('../models/file')

exports.upload_files = (req, res) => {
    File.all(function (err, docs) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
}
