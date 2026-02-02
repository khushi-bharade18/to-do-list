// Access the main button
const btn = document.querySelector("#btn");
let isToDoVisible = false;
btn.addEventListener("click", toggleTodo);

// Create an array and get the array from local storage
let arr = JSON.parse(localStorage.getItem("todo")) || [];

function showToDo() {
  if (document.querySelector("#outerBoxId")) return;

  // Create outer box
  const outerBox = document.createElement("div");
  outerBox.className = "w-full px-4 flex flex-col gap-4 md:gap-5";
  outerBox.id = "outerBoxId";

  // Create first task box
  const taskBox = document.createElement("div");
  taskBox.className = "w-full md:w-[50%] m-auto";

  // Create form inside task box
  const form = document.createElement("form");
  form.className = "flex justify-center gap-2";
  form.method = "post";

  // Create input field for write tasks
  const input = document.createElement("input");
  input.className =
    "px-3 py-2 md:px-4 md:py-3 text-[16px] md:text-[20px] border-2 text-gray-600 rounded w-full focus:border-gray-600 focus:outline-none placeholder:text-gray-600";
  input.type = "text";
  input.name = "task";
  input.id = "task";
  input.placeholder = "Enter Your Task";
  input.required = true;

  // Create add button for adding tasks
  const addBtn = document.createElement("button");
  addBtn.className =
    "px-3 py-2 md:px-4 md:py-3 text-[12px] md:text-[20px] bg-green-100 border-2 rounded text-green-500 font-bold transition-all cursor-pointer hover:bg-green-500 hover:text-white";
  addBtn.innerHTML = "Add";
  addBtn.type = "submit";

  const msg = document.createElement("p");
  msg.id = "editHint";
  msg.innerText = "For editing, double-click on the task.";
  msg.className = "text-center text-gray-500 text-sm md:text-md my-1 ";

  form.addEventListener("submit", addTask);
  form.append(input, addBtn);
  taskBox.append(form, msg);

  // Create table box
  const tableBox = document.createElement("div");
  tableBox.className = "w-full md:w-[50%] m-auto";

  // Create table for show the tasks
  const table = document.createElement("table");
  table.className = "min-w-full bg-white rounded overflow-x-auto";

  // Create tbody
  const tbody = document.createElement("tbody");
  tbody.id = "tbodyId";

  table.appendChild(tbody);
  tableBox.appendChild(table);
  outerBox.append(taskBox, tableBox);
  document.body.appendChild(outerBox);

  // Render the tasks
  arr.forEach((obj) => {
    taskRow(obj);
  });
}

function toggleTodo() {
  const existingBox = document.querySelector("#outerBoxId");

  if (!isToDoVisible) {
    showToDo();
    btn.innerText = "Hide My To-Do List";
    isToDoVisible = true;
  } else {
    existingBox.remove();
    btn.innerText = "Show My To-Do List";
    isToDoVisible = false;
  }
}

function addTask(e) {
  e.preventDefault();
  let taskValue = document.getElementById("task").value.trim();
  if (!taskValue) {
    alert("Please fill the field.");
    return;
  }

  let taskObj = {
    status: false,
    task: taskValue,
    id: Date.now(),
  };
  arr.push(taskObj);
  localStorage.setItem("todo", JSON.stringify(arr));
  taskRow(taskObj);
  e.target.reset();
}

function taskRow(obj) {
  // Create table row
  const tr = document.createElement("tr");
  tr.dataset.id = obj.id;

  // Create table data
  const td1 = document.createElement("td");
  td1.className = "p-2 md:p-4 text-center";
  // Create a checkbox for task status
  const status = document.createElement("input");
  status.className =
    "cursor-pointer w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 accent-gray-600";
  status.type = "checkbox";
  status.checked = obj.status;
  td1.appendChild(status);

  const td2 = document.createElement("td");
  td2.className =
    "p-2 md:p-4 text-center text-[16px] md:text-[20px] text-gray-600 font-bold";
  td2.textContent = obj.task;
  td2.addEventListener("dblclick", editTask);

  const td3 = document.createElement("td");
  td3.className = "p-2 md:p-4 text-center";

  // Create a delete button for delete task
  const delBtn = document.createElement("button");
  delBtn.className =
    "delete-btn px-3 py-2 md:px-4 md:py-3 text-[12px] md:text-[20px] border-2 bg-red-100 rounded text-red-500 font-bold transition-all cursor-pointer hover:bg-red-500 hover:text-white";
  delBtn.innerHTML = "Delete";
  delBtn.addEventListener("click", deleteTask);
  td3.appendChild(delBtn);

  // Update status on click
  status.addEventListener("change", () => {
    obj.status = status.checked;
    td2.style.textDecoration = obj.status ? "line-through" : "none";

    if (!obj.status) {
      td2.addEventListener("dblclick", editTask);
    }

    localStorage.setItem("todo", JSON.stringify(arr));
  });

  // Apply line-through style if task is completed
  if (obj.status) {
    td2.removeEventListener("dblclick", editTask);
    td2.style.textDecoration = "line-through";
  }

  tr.append(td1, td2, td3);
  document.getElementById("tbodyId").append(tr);

  // Set the array in the local storage
  localStorage.setItem("todo", JSON.stringify(arr));
}

function deleteTask(e) {
  let ind = arr.findIndex(
    (obj) => obj.id === Number(e.target.parentElement.parentElement.dataset.id),
  );
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

function editTask(e) {
  const taskElement = e.currentTarget;
  const oldTask = taskElement.innerText;
  const row = taskElement.closest("tr");
  const deleteBtn = row.querySelector(".delete-btn");
  const taskId = Number(row.dataset.id);
  const index = arr.findIndex((obj) => obj.id === taskId);

  // prevent multiple edit inputs
  if (taskElement.querySelector("input")) {
    return;
  }
  if (arr[index].status === true) {
    alert("You don't edit this task. It was already completed");
    return;
  }

  //Create input field for editthe task
  const editInput = document.createElement("input");
  editInput.className =
    "px-3 py-2 md:px-4 md:py-3 text-[12px] md:text-[20px] border-2 text-gray-600 rounded w-full focus:border-gray-600 focus:outline-none placeholder:text-gray-600";
  editInput.type = "text";
  editInput.name = "editInput";
  editInput.id = "editInputId";
  editInput.value = taskElement.innerText;
  taskElement.innerText = "";
  taskElement.appendChild(editInput);
  editInput.focus();

  // Create edit button for save the edited task
  const editBtn = document.createElement("button");
  editBtn.className =
    "m-1 px-3 py-2 md:px-4 md:py-3 text-[12px] md:text-[20px] border-2 bg-gray-100 rounded text-gray-500 font-bold transition-all cursor-pointer hover:bg-gray-500 hover:text-white";
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", () => {
    const newText = editInput.value.trim();
    // prevent empty or space-only edits
    if (!newText) {
      return;
    }
    if (index !== -1) {
      arr[index].task = newText;
    }
    taskElement.innerText = newText;
    localStorage.setItem("todo", JSON.stringify(arr));
    editBtn.nextElementSibling.remove();
    editBtn.remove();
    deleteBtn.style.display = "inline-block";
  });

  // Create cancel button for cancel the editing
  const cancelBtn = document.createElement("button");
  cancelBtn.className =
    "m-1 px-3 py-2 md:px-4 md:py-3 text-[16px] md:text-[20px] border-2 bg-red-100 rounded text-red-500 font-bold transition-all cursor-pointer hover:bg-red-500 hover:text-white";
  cancelBtn.innerHTML = "Cancel";
  cancelBtn.addEventListener("click", (e) => {
    taskElement.innerText = oldTask;

    cancelBtn.previousElementSibling.remove();
    cancelBtn.remove();
    deleteBtn.style.display = "inline-block";
  });
  deleteBtn.style.display = "none";

  this.parentElement.childNodes[2].append(editBtn, cancelBtn);
}
