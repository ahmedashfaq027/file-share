const savedDiv = document.querySelector(".saved");

getLinksFromLocalStorage();

function getLinksFromLocalStorage() {
    const lsKey = "sharefiles";
    const lsString = JSON.parse(localStorage.getItem(lsKey)) || [];

    lsString.forEach((item) => {
        createSavedLinkDiv(item);
    });
}

function createSavedLinkDiv(item) {
    console.log(item);
    const savedLinkDiv = document.createElement("p");
    savedLinkDiv.classList.add("saved-item");

    const addedOn = new Date(item.addedOn);
    const dateSpan = document.createElement("span");
    dateSpan.innerHTML = `${addedOn.getDate()}/${addedOn.getMonth()}/${addedOn.getFullYear()} ${addedOn.getHours()}:${addedOn.getMinutes()}:${addedOn.getSeconds()}`;

    const linkDiv = document.createElement("a");
    linkDiv.href = item.link;
    linkDiv.target = "_blank";
    linkDiv.innerText = item.link;

    savedLinkDiv.appendChild(dateSpan);
    savedLinkDiv.appendChild(linkDiv);

    savedDiv.appendChild(savedLinkDiv);
}
