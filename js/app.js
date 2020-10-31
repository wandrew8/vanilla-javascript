document.addEventListener('DOMContentLoaded', function () {

    // Global Variables
    const cardContainer = document.querySelector(".card-container");
    const addButton = document.querySelector(".add-button");
    const addWishListForm = document.querySelector(".add-wishlist-form");
    const jobTitle = document.querySelector("#job-title");
    const company = document.querySelector("#company-name");
    const modalEl = document.querySelector("#modalForm");
    const modalEl2 = document.querySelector("#modalAlert");
    const modal = M.Modal.init(modalEl);
    const modal2 = M.Modal.init(modalEl2);
    const numJobs = document.querySelector(".numJobs");
    const confirmButton = document.querySelector(".confirm");

    let jobs = JSON.parse(window.localStorage.getItem("wishlist")) || [];
    let confirmId = "";

    function saveToLocal() {
        const array = JSON.stringify(jobs);
        window.localStorage.setItem("wishlist", array);
    }

    function showModal() {
        modal.open();
    }

    function closeModal() {
        modal.close();
    }

    function displayAmount() {
        numJobs.textContent = jobs.length === 1 ? `${jobs.length} Job` : `${jobs.length} Jobs`;
    }

    function renderJobs() {
        cardContainer.innerHTML = "";
        jobs.forEach((jobEntry, i) => {
            const { company, job, dateAdded, color } = jobEntry;
            cardContainer.innerHTML += `
                <div class="card" data-item="${dateAdded}" style="background-color:${color}">
                    <div class="card-stacked">
                        <div class="card-content">
                            <button data-target="modalAlert" class="btn-floating delete-button btn-large waves-effect waves-light"><i class="material-icons delete">delete</i></button>
                            <h3 class="truncate">${company}</h3>
                            <p class="truncate">${job}</p>
                            <div class="date-container truncate"> 
                                <p class="date truncate">added ${moment(dateAdded).fromNow()}...</p>
                            </div>
                        </div>
                    </div>
            </div>
            `;
        });
        displayAmount();

    }

    function resetForm() {
        const labels = document.querySelectorAll("label");
        company.value = "";
        jobTitle.value = "";
        labels.forEach(label => {
            label.classList.remove("active");
        })
    }

    function addJob(e) {
        e.preventDefault();
        const newJob = {
            company: company.value,
            job: jobTitle.value,
            dateAdded: Date.now(),
            color: randomColor()
        }
        jobs.push(newJob);
        resetForm();
        closeModal();
        renderJobs();
        saveToLocal();
    }

    function randomColor() {
        return `hsla(${(Math.random() * 360)}, 100%, 50%, 1)`;
    }

    function removeJob(id) {
        console.log("clicked")
        const match = (element) => element.dateAdded == id;
        const index = jobs.findIndex(match);
        if (index > -1) {
            jobs = [...jobs.slice(0, index), ...jobs.slice(index + 1)];
            saveToLocal();
            renderJobs();
        } 
    }

    // Event Listeners
    addButton.addEventListener("click", showModal);
    addWishListForm.addEventListener("submit", addJob);
    confirmButton.addEventListener("click", () => (removeJob(confirmId)));
    cardContainer.addEventListener("click", (e) => {
        if(Array.from(e.target.classList).includes("delete")) {
            modal2.open();
            const card = e.target.closest(".card");
            const id = card.dataset.item;
            confirmId = id;
        }
    })

    renderJobs();   
});