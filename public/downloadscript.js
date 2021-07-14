const downloadSelected = document.querySelector("#files-download-selected");
const selectedFiles = document.querySelectorAll(".file-available input");
const selectedFilesCount = document.querySelector(".selected-files-count span");
let arrFiles = [];

selectedFiles.forEach((cb, index) => {
    cb.addEventListener("change", (e) => {
        const fileName = e.target.parentNode.innerText.trim();
        if (e.target.checked) {
            arrFiles.push(fileName);
        } else {
            arrFiles = arrFiles.filter((file) => file !== fileName);
        }
        enableDownloadBtn();
        updateSelectedFilesCount(arrFiles.length);
    });
});

enableDownloadBtn();
downloadSelected.addEventListener("click", async (e) => {
    let url = window.location.pathname.trim().replace("/view", "");
    url += "?";
    arrFiles.forEach((item, index) => {
        if (index === 0) {
            url += `item=${item}`;
        } else {
            url += `&item=${item}`;
        }
    });

    window.open(url, "_blank");

    // Reset
    arrFiles = [];
    uncheckAll();
    updateSelectedFilesCount(arrFiles.length);
    enableDownloadBtn();
});

function enableDownloadBtn() {
    if (arrFiles.length !== 0) {
        downloadSelected.disabled = false;
    } else {
        downloadSelected.disabled = true;
    }
    console.log(arrFiles.length);
}

function uncheckAll() {
    selectedFiles.forEach((cb) => {
        cb.checked = false;
    });
}

function updateSelectedFilesCount(count) {
    selectedFilesCount.innerText = count;
}

function addSelectedFiles(files) {
    files.forEach((item) => {
        createSelectedFileDiv(item);
    });

    updateSelectedFilesCount(arrFiles.size);
}
