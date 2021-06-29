const file = document.querySelector('#file');
const selectedFiles = document.querySelector(".selected-files");
const uploadBtn = document.querySelector("#files-upload");
let arrFiles = new Map();

file.addEventListener('change', (e) => {
    addSelectedFiles([...e.target.files]);
})

uploadBtn.addEventListener('click', async e => {
    const res = await fetch("/files", {
        method: "post",
        body: JSON.stringify({
            files: arrFiles
        })
    })
        .then(response => response.json())
        .catch(err => console.log(err));

    console.log(res)
})

function createSelectedFileDiv(file) {
    const key = file.lastModified + file.size;
    arrFiles.set(key, file)

    const p = document.createElement('p');
    p.className = "selected-file";
    p.setAttribute("data-file", key);

    const x = document.createElement('button');
    x.type = "button";
    x.innerText = "x";
    x.addEventListener('click', removeSelectedFileDiv);

    p.innerHTML = file.name;
    p.appendChild(x);
    selectedFiles.appendChild(p);
}

function removeSelectedFileDiv(e) {
    const parent = e.target.parentNode;
    const id = parent.getAttribute("data-file");
    selectedFiles.removeChild(parent);

    arrFiles.delete(parseInt(id));
    console.log(arrFiles);
}

function addSelectedFiles(files) {
    files.forEach(item => {
        createSelectedFileDiv(item);
    })

    console.log(arrFiles);
}