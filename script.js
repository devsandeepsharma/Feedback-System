const baseAPI = "https://crudcrud.com/api/e3dbe6adac254fd8ba356999b6877620";

const form = document.querySelector("form");
const formBtn = document.getElementById("form-btn");

form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const rating = e.target.rating.value;

    if(!form.checkValidity()) {
        form.classList.add("was-validated");
        return; 
    }

    addData(username, rating);
    if(formBtn.textContent === "Update Rating") {
        formBtn.textContent = "Submit Rating";
    };
}

async function addData(username, rating) {
    const feedback = {
        username, rating
    }
    try {
        const res = await fetch(`${baseAPI}/feedback`, {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(feedback)})
        console.log(res)
    } catch (error) {
        console.log(error);
    }

    loadData();
    form.reset();
}

async function deleteData(id) {
    try {
        const res = await fetch(`${baseAPI}/feedback/${id}`, {method:"delete"})
        if(res.ok) loadData();
    } catch (error) {
        console.log(error);
    }
}

function editData(id, name, rating) {
    const username = document.getElementById("username");
    const newRating = document.getElementById("rating");

    username.value = name;
    newRating.value = rating;
    formBtn.textContent = "Update Rating";
    deleteData(id);
}

async function loadData() {
    try {
        const res = await fetch(`${baseAPI}/feedback`);
        const data = await res.json();
        displayCard(data);
        displayFeedbackOverview(data);
    } catch (error) {
        console.log(error);
    }
}

function displayFeedbackOverview(data) {
    const overviewContainer = document.getElementById("overview-container");

    const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(element => summary[element.rating]++);

    const html = Object.keys(summary).map(key => (
        `
        <div class="p-2 col bg-dark-subtle text-dark-emphasis rounded">
            <p class="text-center m-0">${key}</p>
            <p class="text-center m-0 fs-3 fw-bold">${summary[key]}</p>
        </div>
        `
    )).join("");

    overviewContainer.innerHTML = html;
}

function displayCard(data) {
    const container = document.getElementById("feedback-container");
    const html = data.map(element => {
        return `
        <div class="col">
            <div class="card w-100 border-top-0 border-end-0 border-bottom-0 border-5 border-primary">
                <h2 class="card-header">${element.username}</h2>
                <div class="card-body">
                    <h3 class="card-subtitle text-body-secondary">Stars. ${element.rating}/-</h3>
                    <div class="card-text">
                        ${element.rating < 3 ? "Oops only": "Awesome"} ${element.rating} star ratings...
                    </div>
                    <div class="mt-3 d-flex gap-2">
                        <button class="btn btn-outline-dark flex-fill" onclick="editData('${element._id}', '${element.username}', '${element.rating}')">Edit</button>
                        <button class="btn btn-dark flex-fill" onclick="deleteData('${element._id}')">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }).reverse().join("");

    if(data.length >= 1) {
        container.innerHTML = html;
    } else {
        container.innerHTML = "<h3>Add your rating...</h3>"
    }
}

loadData();