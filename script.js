// A basic ajax request
//window.onload = (event) => {alert('page is fully loaded');};
//let url = "http://127.0.0.1:8000/api/listings?page=1order%5BcreatedAt%5D=desc";

let baseUrl = "http://127.0.0.1:8000";
let defaultPage = "/api/listings?page=1";
let defaultFilters = "&order%5BcreatedAt%5D=desc"
//Full URL (default)
let url = baseUrl.concat(defaultPage).concat(defaultFilters);

window.onload = (event) => {
    loadListingsCollection(url);

    const newListingForm = document.getElementById("newListing");
    handleNewListingForm(newListingForm);

    loadCategories();
}



async function loadListingsCollection(url) {
    let data = "";
    console.log("Current URL: ".concat(url));


    let response = await fetch(url);
    data = await response.json();

    //console.log(data['hydra:member'].length);
    //object field: ^^^--->then, array key--->

    //Parent Element
    let parentElement = document.getElementById("test");
    parentElement.innerHTML = "";

    //PAGE Number
    pageStringLocation = data['hydra:view']['@id'].length - 1;
    let pageNumber = document.createElement('div');
    pageNumber.append("Page ".concat(data['hydra:view']['@id'].substr(pageStringLocation, 1)));
    parentElement.append(pageNumber);

    
    console.log(pageStringLocation);

    //NB of Listings
    let listingsNumber = document.createElement('div');
    listingsNumber.append(data['hydra:totalItems']);
    listingsNumber.append(' available listings');
    parentElement.append(listingsNumber);

    //LISTINGS CARDS
    for (var i = 0; i < data['hydra:member'].length; i++) {
        //console.log(data['hydra:member'][i]['title']);


        //Dynamic Card
        let col = document.createElement("div");
        col.classList.add("col", "animate__animated", "animate__backInDown");
        parentElement.append(col);

        let card = document.createElement("div");
        card.classList.add("card", "row", "g-0");
        col.append(card);


        //BODY
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "p-0", "row");
        card.append(cardBody);

        //IMG
        let cardImage = document.createElement('img');
        cardImage.classList.add("col-3", "shadow-0");
        cardImage.src = "http://picsum.photos/id/".concat(Math.floor(Math.random() * 800))/* .concat(i) */.concat("/300/200");
        cardImage.style.borderRadius = "15px 0px 0px 15px";
        cardBody.append(cardImage);


        //BODY SUB
        let cardBodySub = document.createElement('div');
        cardBodySub.classList.add("col-9", "p-0", "pt-3");
        cardBody.append(cardBodySub);

        //TITLE
        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.append(
            data['hydra:member'][i]['title']
        );
        cardBodySub.append(cardTitle);

        //PRICE
        let cardPrice = document.createElement("h6");
        cardPrice.classList.add("card-text", "text-secondary");
        cardPrice.append(
            data['hydra:member'][i]['price'].concat('$')
        );
        cardBodySub.append(cardPrice);

        //!Description disabled
        /* let cardDescription = document.createElement("p");
        cardDescription.classList.add("card-text");
        cardDescription.append(
            data['hydra:member'][i]['description']
        );
        cardBody.append(cardDescription); */

        //OWNER
        let cardOwner = document.createElement("h6");
        cardOwner.classList.add("card-text");
        cardOwner.append('by static OWNER');
        cardBodySub.append(cardOwner);

        let hr = document.createElement("hr");
        cardBodySub.append(hr);

        //CREATED AGO
        let cardCreatedAgo = document.createElement("div");
        cardCreatedAgo.classList.add('fw-light', 'fst-italic');
        cardCreatedAgo.append(
            data['hydra:member'][i]['createdAgo']
        );
        cardBodySub.append(cardCreatedAgo);

        // CATEGORY
        let cardCategory = document.createElement("div");
        cardCategory.classList.add('fw-light', 'text-primary');
        cardCategory.append(
            "#".concat(data['hydra:member'][i]['category']["title"])
        );
        cardBodySub.append(cardCategory);

    }

    //PAGINATION
    //API Pagination links
    let firstPage = data['hydra:view']['hydra:first']; // "/api/listings?page=1"
    let lastPage = data['hydra:view']['hydra:last'];
    let nextPage = data['hydra:view']['hydra:next'];
    let previousPage = data['hydra:view']['hydra:previous'];
    //console.log("NEXT: ".concat(nextPage));
    //console.log("PREV: ".concat(previousPage));

    //HTML buttons
    let firstPageBtn = document.getElementById("firstPageBtn");
    let lastPageBtn = document.getElementById("lastPageBtn");
    let nextPageBtn = document.getElementById("nextPageBtn");
    let previousPageBtn = document.getElementById("previousPageBtn");

    //EVENTS
    firstPageBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (previousPage) {
            changePageFunction(url, firstPage);
            previousPage = "";
        }
    });

    lastPageBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (nextPage) {
            changePageFunction(url, lastPage);
            nextPage = "";
        }
    });

    nextPageBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (nextPage) {
            changePageFunction(url, nextPage);
            nextPage = "";
            previousPage = "";
        }
    });

    previousPageBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (previousPage) {
            changePageFunction(url, previousPage);
            previousPage = "";
            nextPage = "";
        }
    });

    console.log("=============");
}

//Page URL Builder
function changePageFunction(currentUrl, nextPage) {
    if (currentUrl === baseUrl.concat(nextPage)) {
        return "";
    } else {
        newUrl = baseUrl.concat(nextPage);
        loadListingsCollection(newUrl);
    }
};


//Dynamic Form CATEGORY Selector
async function loadCategories() {
    const selectorParent = document.getElementById("categorySelector");
    //let option1 = 

    let response = await fetch("http://127.0.0.1:8000/api/categories");
    let categories = await response.json();

    //console.log(categories['hydra:member'].length);

    for (var i = 0; i < categories['hydra:member'].length; i++) {
        let option = document.createElement("option");
        option.value = categories['hydra:member'][i]["@id"];
        option.append(categories['hydra:member'][i]["title"]);
        selectorParent.append(option);
    }
}
//SEND Create FORM TO API
const newListingForm = document.getElementById("newListing");
function handleNewListingForm(newListingForm) {
    newListingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let fd = new FormData(newListingForm);
        //look at all the contents
        for (let key of fd.keys()) {
            console.log(key, fd.get(key));
        }
        let json = convertFD2JSON(fd);
        console.log(json);


        //send the request with the formdata
        let url = 'http://127.0.0.1:8000/api/listings';
        let h = new Headers();
        h.append('Content-type', 'application/json');

        let req = new Request(url, {
            headers: h,
            body: json,
            method: 'POST',
        });

        fetch(req)
            .then((response) => {
                if (response.status >= 200 && response.status <= 299) {
                    let newListingBtn = document.getElementById('newListingBtn');
                    //disable Send BTN
                    newListingBtn.disabled = true;
                    //Replace inner HTML
                    let parentElement = document.getElementById("test");
                    parentElement.innerHTML = loadListingsCollection("http://127.0.0.1:8000/api/listings?page=1");
                    parentElement.textContent = ("");
                    console.log(parentElement.innerHTML);
                    //Alert
                    let successAlert = document.getElementById("successAlert");
                    successAlert.classList.add('show');



                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            });
    });
}
//JSON Converter
function convertFD2JSON(formData) {
    let obj = {};
    for (let key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return JSON.stringify(obj);
}

