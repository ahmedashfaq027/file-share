# Share Files

## Description

ShareFiles is a simple file share utility that you can deploy on your own server by running few commands.

ShareFiles creates link to the files to be shared which makes it absolutely simple to share files.

## Tech Stack used

1. `Nodejs`
2. `Express`
3. `MongoDB`
4. `EJS (Embedded JavaScript)`

## When can I use this application?

You can use this application when you want to share photos or any types of files with your friends HASSLE-FREE.

## How can I use this application?

1. You can upload any number of files you want with no limit on size of the files. You will get the ID in the response of the object with which you can review and download the files.
2. You can only access the files only if you have MongoDB ObjectID.
3. Previously uploaded file's links are stored in localstorage and can be viewed in the saved page.
4. You can share the link with people you want to share the files with.

## How can I run this project?

1. Setup `Nodejs`
2. Install `MongoDB locally (or) use MongoDB Atlas`
3. Setup `.env` file in this project folder with following properties

    a. DB_URL= < your-mongo-db-url >

4. Run this project using

```bash
npm start
```

## Project Structure

```
│   .env
│   .gitignore
│   app.js
│   package-lock.json
│   package.json
│   README.md
│
├───models
│       files.js
│
├───public
│       icon.png
│       style.css
│       download.css
│       script.js
│       downloadscript.js
│       savedscript.js
│
├───uploads
│       <Uploaded files on the server>
│
└───views
        download.ejs
        home.ejs
        notfound.ejs
        saved.ejs
```
