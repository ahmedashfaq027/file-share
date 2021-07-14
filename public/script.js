const file = document.querySelector("#file");
const selectedFiles = document.querySelector(".selected-files");
const selectedFilesCount = document.querySelector(".selected-files-count span");
const linkToUploaded = document.querySelector(".files-uploaded");
const uploadBtn = document.querySelector("#files-upload");
let arrFiles = new Map();

file.addEventListener("input", (e) => {
    addSelectedFiles([...e.target.files]);
    e.target.value = "";
});

uploadBtn.addEventListener("click", async (e) => {
    let formData = new FormData();
    let files = [...arrFiles.values()];
    files.forEach((file) => {
        formData.append("files", file);
    });

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
    console.log(`${window.location.href}files/${id}`);

    linkToUploaded.style.display = "block";
    const a = linkToUploaded.querySelector("a");
    a.href = `/files/view/${id}`;
    a.target = "_blank";
    a.textContent = `${window.location.href}files/view/${id}`;
}

function hideLinkToUploaded() {
    linkToUploaded.style.display = "none";
}

function updateSelectedFilesCount(count) {
    selectedFilesCount.innerText = count;
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
    updateSelectedFilesCount(arrFiles.size);
}

function removeAllFileDivs() {
    selectedFiles.innerHTML = "";
    updateSelectedFilesCount(arrFiles.size);
}

function addSelectedFiles(files) {
    if (arrFiles.size === 0) {
        hideLinkToUploaded();
    }

    files.forEach((item) => {
        createSelectedFileDiv(item);
    });

    updateSelectedFilesCount(arrFiles.size);
}
