const mongoose = require("mongoose");

const filesSchema = mongoose.Schema({
    fileNames: {
        type: Array,
    },
    filePath: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Files", filesSchema);
