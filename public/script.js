const file = document.querySelector("#file");
const selectedFiles = document.querySelector(".selected-files");
const linkToUploaded = document.querySelector(".files-uploaded");
const uploadBtn = document.querySelector("#files-upload");
let arrFiles = new Map();

file.addEventListener("input", (e) => {
    console.log("input", e.target.value);
    addSelectedFiles([...e.target.files]);
    e.target.value = "";
});

uploadBtn.addEventListener("click", async (e) => {
    let formData = new FormData();
    let files = [...arrFiles.values()];
    files.forEach((file) => {
        formData.append("files", file);
    });

    console.log(formData, files);

    const res = await fetch("/files", {
        method: "post",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => console.log(err));

    arrFiles = new Map();
    removeAllFileDivs();
    showLinkToUploaded(res.data._id);
});

function showLinkToUploaded(id) {
    console.log(id);

    linkToUploaded.style.display = "block";
    const a = linkToUploaded.querySelector("a");
    a.href = `/files/${id}`;
    a.textContent = `${window.location.href}files/${id}`;
}

function createSelectedFileDiv(file) {
    const key = file.lastModified + file.size;
    if (!arrFiles.has(key)) {
        const p = document.createElement("p");
        p.className = "selected-file";
        p.setAttribute("data-file", key);

        const x = document.createElement("button");
        x.type = "button";
        x.innerText = "x";
        x.addEventListener("click", removeSelectedFileDiv);

        p.innerHTML = file.name;
        p.appendChild(x);
        selectedFiles.appendChild(p);

        arrFiles.set(key, file);
    }
}

function removeSelectedFileDiv(e) {
    const parent = e.target.parentNode;
    const id = parent.getAttribute("data-file");
    selectedFiles.removeChild(parent);

    arrFiles.delete(parseInt(id));
    console.log(arrFiles);
}

function removeAllFileDivs() {
    selectedFiles.innerHTML = "";
}

function addSelectedFiles(files) {
    files.forEach((item) => {
        createSelectedFileDiv(item);
    });

    console.log(arrFiles);
}
