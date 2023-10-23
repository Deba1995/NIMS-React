"use strict";

const form = document.getElementById(`formEditClient`);

const addDepartmentBtn = document.querySelector("#addDept");
const addNewDepartment = document.querySelector("#addNewDept");
const value = document.querySelector("#departmentName");
const list = document.querySelector("#deptList");
const departmentName_err = document.querySelector("#departmentName_err");
const editInput = document.getElementById("editdepartmentName");
const successNotification = document.querySelector("#success-notification");
const editdepartmentName_err = document.querySelector(
  "#editdepartmentName_err"
);
let currentlyEditingItem = null; // Variable to store the currently edited list item

addDepartmentBtn.addEventListener("click", () => {
  departmentName_err.textContent = "";
  departmentName_err.style.display = "hidden";
});

addNewDepartment.addEventListener("click", () => {
  if (value.value != "") {
    const div = `<li class="d-flex mb-4 align-items-center" data-department-name="${value.value}">
                              <div class="ms-3 flex-grow-1">
                                <h6>${value.value}</h6>
                              </div>
                              <div class="dropdown">
                                <span
                                  class="dropdown-toggle"
                                  id="dropdownMenuButton9"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  role="button"
                                >
                                </span>
                                <div
                                  class="dropdown-menu dropdown-menu-end"
                                  aria-labelledby="dropdownMenuButton9"
                                >
                                  <button type="button"
                                    class="dropdown-item removeButton"
                                    >Remove</button
                                  >
                                  <button
                                  type="button"
                                          class="dropdown-item editButton"
                                          data-bs-toggle="modal"
                                          data-bs-target="#staticBackdropEdit"
                                          data-bs-original-title="Edit"  
                                            >
                                              Edit
                                            </button>
                                </div>
                              </div>
                            </li>`;

    document.querySelector("#closeDept").click();
    list.insertAdjacentHTML("afterbegin", div);
    value.value = "";
  } else {
    departmentName_err.textContent = "Department name cannot be empty";
    departmentName_err.style.display = "block";
  }
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("removeButton")) {
    // This code will execute when any element with the class "removeButton" is clicked.
    // You can perform actions on the clicked element here.

    // For example, you can remove the parent <li> element when the remove button is clicked:
    const listItem = event.target.closest("li");
    if (listItem) {
      listItem.remove();
    }
  }

  if (event.target.classList.contains("editButton")) {
    editdepartmentName_err.textContent = "";
    editdepartmentName_err.style.display = "hidden";
    const listItem = event.target.closest("li");
    currentlyEditingItem = listItem;
    // Find the <h6> element within the <li>
    const h6Element = listItem.querySelector("h6");

    // Get the current department name
    const currentDepartmentName = h6Element.innerText;
    // Set the current department name in the modal input field
    editInput.value = currentDepartmentName;
  }

  // Handle the "Confirm" button click
  document.getElementById("confirmEdit").addEventListener("click", () => {
    if (currentlyEditingItem) {
      const newValue = editInput.value;
      if (newValue != "") {
        console.log(newValue);
        h6Element = currentlyEditingItem.querySelector("h6");
        h6Element.innerText = newValue;
        // Save the new value (you'll need to implement this part)
        currentlyEditingItem.setAttribute("data-department-name", newValue);
        // editInput.value = "";
        document.querySelector("#closeEditDept").click();
        currentlyEditingItem = null; // Reset the currently edited item
      } else {
        editdepartmentName_err.textContent = "Department name cannot be empty";
        editdepartmentName_err.style.display = "block";
      }
    }
  });
});

async function saveItem(id) {
  try {
    const formData = new FormData(form);
    for (let [k, j] of formData) {
      //clear error
      const err = document.getElementById(`edit_${k}_err`);
      err.textContent = "";
      err.style.display = "none";
    }

    const ulElement = document.getElementById("deptList");
    let h6Values = [];
    // Loop through each <li> element within the <ul>
    ulElement.querySelectorAll("li").forEach(function (liElement) {
      // Get the <h6> element within the <li>
      const h6Element = liElement.querySelector("h6");

      // Get the text content of the <h6> element and push it into the array
      h6Values.push(h6Element.textContent);
    });
    // Loop through the data array and append each value
    if (h6Values.length > 0) {
      for (let i = 0; i < h6Values.length; i++) {
        formData.append("departments[]", h6Values[i]);
      }
    }

    const dataFormat = new URLSearchParams(formData);
    const res = await fetch(`/client/client-profile/${id}`, {
      method: "PUT",
      body: dataFormat,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await res.json();
    if (data.errors) {
      const entries = Object.entries(data.errors);
      for (let [k, v] of entries) {
        if (v != "") {
          if (
            k === "departments.0" ||
            k === "departments" ||
            k === "departments.$"
          ) {
            k = "departments[]";
          }

          const err = document.getElementById(`edit_${k}_err`);
          err.textContent = v;
          err.style.display = "block";
        }
      }
    }
    if (data.client) {
      successNotification.style.display = "block";
      setTimeout(() => {
        successNotification.style.display = "none";
        location.assign(data.location);
      }, 600);
    }
  } catch (err) {
    console.log(err);
  }
}
