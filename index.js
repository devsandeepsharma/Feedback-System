const API_URL = "https://crudcrud.com/api/dd11bdc19e904ebc9f0c42697e09a2bc/feedbacks";

document.getElementById("feedback-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const rating = document.getElementById("rating").value;
    const feedback = { name, rating };
    try {
        const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(feedback) });
        if (!response.ok) throw new Error("Failed to submit feedback");
        fetchFeedbacks();
        e.target.reset();
    } catch (error) {
        console.error("Error submitting feedback:", error);
    }
});

async function fetchFeedbacks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch feedbacks");
        const data = await response.json();
        console.log(data);
        updateFeedbackList(data);
        updateRatingSummary(data);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
    }
}

function updateRatingSummary(feedbacks) {
    const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(feedback => summary[feedback.rating]++);
    document.getElementById("rating-summary").innerHTML = Object.entries(summary).map(([stars, count]) => `<p class="bg-primary-subtle rounded p-3">*${stars} - ${count}</p>`).join(" ");
}

function updateFeedbackList(feedbacks) {
    const feedbackList = document.getElementById("feedback-list");
    feedbackList.innerHTML = "";
    feedbacks.forEach(feedback => {
        const card = document.createElement("div");
        card.className = "col-md-6";
        card.innerHTML = `
            <div class="rounded card p-3 mb-3">
                <h5>${feedback.name}</h5>
                <p>Rating: ${feedback.rating}</p>
                <div class="btn-group">
                    <button class="btn btn-info btn-sm" onclick="editFeedback('${feedback._id}', '${feedback.name}', '${feedback.rating}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFeedback('${feedback._id}')">Delete</button>
                </div>
            </div>
        `;
        feedbackList.appendChild(card);
    });
}

async function deleteFeedback(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete feedback");
        fetchFeedbacks();
    } catch (error) {
        console.error("Error deleting feedback:", error);
    }
}

function editFeedback(id, name, rating) {
    const nameInput = document.getElementById("name");
    const ratingInput = document.getElementById("rating");
    const submitButton = document.querySelector("#feedback-form button");

    nameInput.value = name;
    ratingInput.value = rating;
    submitButton.textContent = "Update";
    deleteFeedback(id);
    document.getElementById("feedback-form").onsubmit = async function(e) {
        e.preventDefault();
        try {
            const updatedFeedback = { name: nameInput.value, rating: ratingInput.value };
            const response = await fetch(`${API_URL}/${id}`, { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(updatedFeedback) 
            });

            if (!response.ok) throw new Error("Failed to update feedback");

            fetchFeedbacks();
            e.target.reset();
            submitButton.textContent = "Submit Feedback";
            this.onsubmit = submitFeedback;  
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
    };
}


fetchFeedbacks();