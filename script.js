// Access the main button
const btn = document.querySelector("#btn");
btn.addEventListener("click", showToDo);

// Create an array and get the array from local storage
let arr = JSON.parse(localStorage.getItem("todo")) || [];

function showToDo() {
  // Create outer box
  let outerBox = document.createElement("div");
  outerBox.className = "w-full px-4 flex flex-col gap-4 md:gap-6";
  outerBox.id = "outerBoxId";

  // Create first task box
  let taskBox = document.createElement("div");
  taskBox.className = "w-full md:w-[50%] m-auto";

  // Create form inside task box
  let form = document.createElement("form");
  form.className = "flex justify-center gap-2";
  form.method = "post";

  // Create input field for write tasks
  let input = document.createElement("input");
  input.className =
    "px-3 py-2 md:px-4 md:py-3 text-[16px] md:text-[20px] border-2 text-gray-600 rounded w-full focus:border-gray-600 focus:outline-none placeholder:text-gray-600";
  input.type = "text";
  input.name = "task";
  input.id = "task";
  input.placeholder = "Enter Your Task";
  input.required = true;

  // Create add button for adding tasks
  let addBtn = document.createElement("button");
  addBtn.className =
    "px-3 py-2 md:px-4 md:py-3 text-[16px] md:text-[20px] bg-green-100 border-2 rounded text-green-500 font-bold transition-all cursor-pointer hover:bg-green-500 hover:text-white";
  addBtn.innerHTML = "Add";
  addBtn.type = "submit";

  form.addEventListener("submit", addTask);
  form.append(input, addBtn);
  taskBox.append(form);

  // Create table box
  let tableBox = document.createElement("div");
  tableBox.className = "w-full md:w-[50%] m-auto";

  // Create table for show the tasks
  let table = document.createElement("table");
  table.className = "min-w-full bg-white rounded overflow-x-auto";

  // Create tbody
  let tbody = document.createElement("tbody");
  tbody.id = "tbodyId";

  table.appendChild(tbody);
  tableBox.appendChild(table);
  outerBox.append(taskBox, tableBox);
  document.body.appendChild(outerBox);

  // Render the tasks
  arr.forEach((obj) => {
    taskRow(obj);
  });

  // Disable the main button
  btn.disabled = true;
}

function addTask(e) {
  e.preventDefault();
  let taskObj = {
    status: false,
    task: document.getElementById("task").value,
    id: Date.now(),
  };
  // Push the task object in the array
  arr.push(taskObj);

  taskRow(taskObj);
  e.target.reset();
}

function taskRow(obj) {
  // Create table row
  let tr = document.createElement("tr");
  // Create table data
  let td1 = document.createElement("td");
  td1.className = "p-2 md:p-4 text-center";
  // Create a checkbox for task status
  let status = document.createElement("input");
  status.className =
    "cursor-pointer w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 accent-gray-600";
  status.type = "checkbox";
  status.checked = obj.status;
  td1.appendChild(status);

  let td2 = document.createElement("td");
  td2.className =
    "p-2 md:p-4 text-center text-[16px] md:text-[20px] text-gray-600 font-bold";
  td2.textContent = obj.task;

  let td3 = document.createElement("td");
  td3.className = "p-2 md:p-4 text-center";
  // Create a delete button for delete task
  let delBtn = document.createElement("button");
  delBtn.className =
    "px-3 py-2 md:px-4 md:py-3 text-[16px] md:text-[20px] border-2 bg-red-100 rounded text-red-500 font-bold transition-all cursor-pointer hover:bg-red-500 hover:text-white";
  delBtn.innerHTML = "Delete";
  delBtn.value = obj.id;
  delBtn.addEventListener("click", deleteTask);
  td3.appendChild(delBtn);

  // Update status on click
  status.addEventListener("change", () => {
    obj.status = status.checked;
    localStorage.setItem("todo", JSON.stringify(arr));
    td2.style.textDecoration = obj.status ? "line-through" : "none";
  });

  // Apply line-through style if task is completed
  if (obj.status) {
    td2.style.textDecoration = "line-through";
  }

  tr.append(td1, td2, td3);
  document.getElementById("tbodyId").append(tr);

  // Set the array in the local storage
  localStorage.setItem("todo", JSON.stringify(arr));
}

function deleteTask(e) {
  let ind = arr.findIndex((obj) => obj.id === Number(e.target.value));
  // Check the task is completed or not
  if (arr[ind].status !== true) {
    let conf = window.confirm("You want to delete the task ?");
    if (!conf) return;
  }
  // Delete the task
  arr.splice(ind, 1);
  localStorage.setItem("todo", JSON.stringify(arr));
  this.parentElement.parentElement.remove();
}
