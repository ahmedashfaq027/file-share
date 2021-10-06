const file = document.querySelector("#file");
const selectedFiles = document.querySelector(".selected-files");
const selectedFilesCount = document.querySelector(".selected-files-count span");
const linkToUploaded = document.querySelector(".files-uploaded");
const errorDiv = document.querySelector(".files-uploaded-error");
const uploadBtn = document.querySelector("#files-upload");
const uploadProgressBar = document.querySelector(".uploadBar")

let arrFiles = new Map();

file.addEventListener("input", (e) => {
    addSelectedFiles([...e.target.files]);
    e.target.value = "";
});

uploadBtn.addEventListener("click", async (e) => {
    getProgress();
    let formData = new FormData();
    let files = [...arrFiles.values()];
    files.forEach((file) => {
        formData.append("files", file);
    });

    let res = await fetch("/files", {
        method: "post",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => err);

    if (res.status === "failed") {
        showErrorDiv();
    }

    arrFiles = new Map();
    removeAllFileDivs();
    showLinkToUploaded(res.data._id);
});

async function getProgress(){
    showProgressBar()
   let progress = 0;
   while(progress < 100){
      let res = await fetch("/progress", {
        method: "get",
        
    })
        .then((response) => response.json())
        .then((data) => data)
        .catch((err) => err);
        progress = (res.progress | 0)
        updateProgressBar(progress);
   }
   hideProgressBar()   
}


function showProgressBar(){
    uploadProgressBar.style.display = "block";
}

function hideProgressBar(){
    uploadProgressBar.style.display = "none";
}

function updateProgressBar(per){
    uploadProgressBar.value = per;
}

function showErrorDiv() {
    errorDiv.style.display = "flex";
}

function hideErrorDiv() {
    errorDiv.style.display = "none";
}

function showLinkToUploaded(id) {
    if (id) {
        console.log(`${window.location.href}files/${id}`);
        const link = `${window.location.href}files/view/${id}`;

        linkToUploaded.style.display = "block";
        const a = linkToUploaded.querySelector("a");
        a.href = `/files/view/${id}`;
        a.target = "_blank";
        a.textContent = link;

        addLinkToLocalStorage(link);
    }
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
        hideErrorDiv();
    }

    files.forEach((item) => {
        createSelectedFileDiv(item);
    });

    updateSelectedFilesCount(arrFiles.size);
}

function addLinkToLocalStorage(link) {
    const lsKey = "sharefiles";

    let lsString = JSON.parse(localStorage.getItem(lsKey)) || [];
    if (lsString.length !== 0) {
        lsString.push({ link, addedOn: Date.now() });
    } else {
        lsString = [{ link, addedOn: Date.now() }];
    }

    localStorage.setItem(lsKey, JSON.stringify(lsString));
}
