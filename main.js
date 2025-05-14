

let loader = document.querySelector(".loader");
let dataBlock = document.querySelector(".data");
let searchInput = document.getElementById("search");
let sortSelect = document.getElementById("sort");

let allUsers = []; // Foydalanuvchilarni globalda saqlaymiz

function renderData(datas) {
  dataBlock.innerHTML = "";
  datas.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.setAttribute("data-name", `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`);
    userCard.innerHTML = `
      <img src="${user.picture.large}" alt="Profil rasmi">
      <h2>${user.name.first} ${user.name.last}</h2>
      <p><strong>Yosh:</strong> ${user.dob.age}</p>
      <p><strong>Telefon:</strong> ${user.phone}</p>
      <p><strong>Email:</strong><br> ${user.email}</p>
      <p><strong>Manzil:</strong> ${user.location.city}, ${user.location.country}</p>
    `;
    dataBlock.appendChild(userCard);
  });
}

async function getData() {
  loader.style.display = "block";
  try {
    let response = await fetch("https://randomuser.me/api/?results=100");
    let data = await response.json();
    allUsers = data.results;
    applyFilters();
  } catch (error) {
    console.log("error", error);
  } finally {
    loader.style.display = "none";
  }
}

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;

  let sortQilish = allUsers.filter((user) => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    return fullName.includes(query);
  });

  if (sortValue === "name-asc") {
    sortQilish.sort((a, b) => a.name.first.localeCompare(b.name.first));
  } else if (sortValue === "name-desc") {
    sortQilish.sort((a, b) => b.name.first.localeCompare(a.name.first));
  } else if (sortValue === "age-asc") {
    sortQilish.sort((a, b) => a.dob.age - b.dob.age);
  } else if (sortValue === "age-desc") {
    sortQilish.sort((a, b) => b.dob.age - a.dob.age);
  }

  renderData(sortQilish);
}

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener("change", applyFilters);

getData();
