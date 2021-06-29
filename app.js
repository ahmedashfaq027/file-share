const fs = require("fs");
const express = require("express");
const app = express();
const multer = require("multer");
const mongoose = require("mongoose");
const FilesModel = require("./models/files");
const zip = require("express-zip");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = "uploads/" + file.fieldname + "_" + req.id;
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

// generate unique ID
function idMiddleware(req, res, next) {
    req.id = Date.now();
    next();
}

// Middlewares
app.use("*", idMiddleware);
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// DB Connection
mongoose.connect(
    "mongodb://localhost:27017/fileshare",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log(`Database is connected.`);
    }
);

// Routes
app.get("/", (req, res) => {
    res.render("home", {});
});

app.get("/files/:id", async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(404).json({
            status: "failed",
            message: "Not found",
        });
    } else {
        try {
            FilesModel.findOne({ _id: id }).then((resp) => {
                console.log(resp);
                const path = [];
                resp.fileNames.forEach((item) => {
                    if (fs.existsSync(resp.filePath + "/" + item)) {
                        path.push({
                            path: resp.filePath + "/" + item,
                            name: item,
                        });
                    }
                });

                if (path.length !== 0) {
                    return res.status(200).zip(path);
                } else {
                    return res.status(404).json({
                        status: 404,
                        message: "Files not found or might have deleted",
                    });
                }
            });
        } catch (err) {
            return res.json({
                status: 404,
                message: "Not found",
                err: err,
            });
        }
    }
});

app.post("/files", upload.array("files"), async (req, res) => {
    const files = req.files;
    console.log(files);

    if (files) {
        const dest = files[0].destination;
        let fileNames = [];
        files.forEach((item) => {
            fileNames.push(item.originalname);
        });

        const filesSave = new FilesModel({
            fileNames: fileNames,
            filePath: dest,
        });

        try {
            const saved = await filesSave.save();

            return res.status(201).json({
                status: "success",
                message: "files Saved",
                data: saved,
            });
        } catch (err) {
            return res.status(403).json({
                status: "failed",
                message: "Unable to save",
                err: err,
            });
        }
    } else {
        return res.json({
            status: 404,
            message: "files not found or upload error",
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
