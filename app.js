const fs = require("fs");
const express = require("express");
const app = express();
const multer = require("multer");
const mongoose = require("mongoose");
const FilesModel = require("./models/files");
const zip = require("express-zip");
require("dotenv/config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./uploads/sharefiles_${req.id}`;
        if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
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

// Progress bar middleware
let uploadProgress = 0;
function progressMid(req,res,next){
    let progress =0;
    const fileSize = req.headers["content-length"];

   // event listener
    req.on("data",(chunk)=>{
         progress += chunk.length;
         const percentage = (progress/fileSize) * 100;
         uploadProgress = percentage;
    });

    next();
}

// DB Connection
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log(`Database is connected.`);
    }
);

// Routes
app.get("/", (req, res) => {
    res.render("home", {});
});

app.get("/saved", (req, res) => {
    res.render("saved", {});
});

app.get("/files/:id", async (req, res) => {
    const id = req.params.id;
    const fileNames = req.query.item;
    // console.log("Query Params >>>>>", fileNames);

    if (!id) {
        return res.status(404).json({
            status: "failed",
            message: "Not found",
        });
    } else {
        try {
            FilesModel.findOne({ _id: id }).then((resp) => {
                // console.log("mongoose has >>>>>", resp);
                const path = [];
                resp.fileNames.forEach((item) => {
                    if (fs.existsSync(resp.filePath + "/" + item)) {
                        if (fileNames) {
                            if (fileNames.includes(item)) {
                                path.push({
                                    path: resp.filePath + "/" + item,
                                    name: item,
                                });
                            }
                        } else {
                            path.push({
                                path: resp.filePath + "/" + item,
                                name: item,
                            });
                        }
                    }
                });

                // console.log("downloaded >>>>>", path);
                if (path.length !== 0) {
                    let fileName = resp.filePath.split("/");
                    fileName = fileName[fileName.length - 1];
                    return res
                        .status(200)
                        .zip(
                            path,
                            (fileName ? fileName : "share-files-attachment") +
                                ".zip"
                        );
                } else {
                    return res.status(404).json({
                        status: 404,
                        message:
                            "Files not found or might have deleted or expired",
                    });
                }
            });
        } catch (err) {
            return res.status(404).json({
                status: 404,
                message: "Not found",
                err: err,
            });
        }
    }
});

app.get("/files/view/:id", async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(404).json({
            status: "failed",
            message: "Not found",
        });
    } else {
        try {
            FilesModel.findOne({ _id: id })
                .then((resp) => {
                    // console.log(resp);
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
                        res.render("download", {
                            path: path,
                            downloadAll: `${req.originalUrl.replace(
                                "/view",
                                ""
                            )}`,
                        });
                    } else {
                        res.render("notfound", {
                            errMessage: "Uh-oh! Files not found on server :(",
                        });
                    }
                })
                .catch((err) => {
                    res.render("notfound", {
                        errMessage: res.render("notfound", {
                            errMessage:
                                "Uh-oh! Could not find the requested file(s) in the database :(",
                        }),
                    });
                });
        } catch (err) {
            res.render("notfound", {
                errMessage: "Uh-oh! Could not find the requested file :(",
            });
        }
    }
});

app.get("/progress", (req,res)=>{
    res.json({progress:uploadProgress});
})

app.post("/files" ,progressMid, upload.array("files"), async (req, res) => {
    const files = req.files;
    //console.log(files);

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
            const path = `./uploads/sharefiles_${req.id}`;
            fs.rmdirSync(path, { recursive: true });

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
