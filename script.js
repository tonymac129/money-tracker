const form = document.getElementById("form");
const itemNameInput = document.getElementById("name-input");
const itemCostInput = document.getElementById("cost-input");
const list = document.getElementById("list");
const balanceSign = document.getElementById("sign");
const balanceDollar = document.getElementById("dollar");
const balanceCent = document.getElementById("cent");
const footerYear = document.getElementById("year");
const clearSaved = document.getElementById("clear");
let balance = localStorage.getItem("balance") ? parseFloat(localStorage.getItem("balance")) : 0;
let transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];
let id = localStorage.getItem("id") ? parseInt(localStorage.getItem("id")) : 0;
footerYear.innerHTML = new Date().getFullYear();
changeBalance(Math.abs(balance).toFixed(2), balance);
//Above is code for initializing everything

if (transactions.length > 0) {
  list.innerHTML = "";
}

transactions
  .sort((transaction, b) => b.id - transaction.id)
  .forEach((transaction) => {
    const newItem = document.createElement("div");
    const deleteBtn = document.createElement("img");
    newItem.classList.add("list-item");
    let date = new Date(transaction.date);
    newItem.innerHTML = `
    <span>${date.toLocaleDateString()}</span>
    <span class="item-name">${transaction.name}</span>
    <span class="${transaction.cost >= 0 ? "positive" : "negative"}">${transaction.cost >= 0 ? "+" : "-"}$${Math.abs(
      transaction.cost
    ).toLocaleString()}</span>`;
    newItem.setAttribute("data-cost", transaction.cost);
    newItem.setAttribute("data-id", transaction.id);
    deleteBtn.src = "/media/delete.svg";
    deleteBtn.classList.add("item-btn");
    deleteBtn.addEventListener("click", () => deleteItem(newItem));
    newItem.appendChild(deleteBtn);
    list.appendChild(newItem);
  });
//Above is code for sorting existing transactions correctly and appending them

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = itemNameInput.value.trim() ? itemNameInput.value.trim() : "Untitled Transaction";
  let cost = itemCostInput.value.trim() ? parseFloat(parseFloat(itemCostInput.value.trim()).toFixed(2)) : 0;
  if (isNaN(cost)) {
    alert("Please enter a valid cost.");
    return;
  }
  balance += parseFloat(cost.toFixed(2));
  localStorage.setItem("balance", balance.toFixed(2));
  let abs = Math.abs(balance).toFixed(2);
  changeBalance(abs, balance);
  //Above is code for changing balance
  transactions.push({
    name,
    cost,
    date: new Date().toLocaleDateString(),
    id: id + 1,
  });
  id++;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("id", id);
  //Above is code for adding item to exisiting transactions local storage
  if (list.children.length === 0) {
    list.innerHTML = "";
  }
  const referenceElement = list.children[0];
  const newItem = document.createElement("div");
  const deleteBtn = document.createElement("img");
  newItem.classList.add("list-item");
  let date = new Date();
  newItem.innerHTML = `
    <span>${date.toLocaleDateString()}</span>
    <span class="item-name">${name}</span>
    <span class="${cost >= 0 ? "positive" : "negative"}">${cost >= 0 ? "+" : "-"}$${Math.abs(cost).toLocaleString()}</span>`;
  newItem.setAttribute("data-cost", cost);
  newItem.setAttribute("data-id", id);
  //Above is code for setting up transaction item HTML
  deleteBtn.src = "media/delete.svg";
  deleteBtn.classList.add("item-btn");
  deleteBtn.addEventListener("click", () => deleteItem(newItem));
  //Above is code for the delete item button
  newItem.appendChild(deleteBtn);
  list.insertBefore(newItem, referenceElement);
  itemNameInput.value = "";
  itemCostInput.value = "";
  itemNameInput.focus();
  //Above is code for appending the elements
});

function changeBalance(amount, current) {
  if (current < 0) {
    balanceSign.innerHTML = "-";
  } else {
    balanceSign.innerHTML = "";
  }
  balanceDollar.innerHTML = parseInt(amount.split(".")[0]).toLocaleString();
  balanceCent.innerHTML = amount.split(".")[1];
}

function deleteItem(item) {
  balance -= parseFloat(item.getAttribute("data-cost"));
  localStorage.setItem("balance", balance.toFixed(2));
  changeBalance(Math.abs(balance).toFixed(2), balance);
  transactions = transactions.filter((transaction) => {
    return transaction.id !== parseInt(item.getAttribute("data-id"));
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
  item.remove();

  if (list.children.length === 0) {
    list.innerHTML = "No items so far. Add an item above to get started!";
  }
}

clearSaved.addEventListener("click", () => {
  if (confirm("⚠️ Are you sure you want to clear all your saved transactions and balance? This action can not be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
});
