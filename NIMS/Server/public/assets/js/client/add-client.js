"use strict";
const addDepartmentBtn = document.querySelector("#addDept");
const addNewDepartment = document.querySelector("#addNewDept");
const value = document.querySelector("#departmentName");
const list = document.querySelector("#deptList");
const departmentName_err = document.querySelector("#departmentName_err");
const form = document.querySelector("#formClient");
const successNotification = document.querySelector("#success-notification");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //reset errors
  const ulElement = document.getElementById("deptList");
  let h6Values = [];
  // Loop through each <li> element within the <ul>
  ulElement.querySelectorAll("li").forEach(function (liElement) {
    // Get the <h6> element within the <li>
    const h6Element = liElement.querySelector("h6");

    // Get the text content of the <h6> element and push it into the array
    h6Values.push(h6Element.textContent);
  });

  const formData = new FormData(form);
  // Loop through the data array and append each value
  if (h6Values.length > 0) {
    for (let i = 0; i < h6Values.length; i++) {
      formData.append("departments[]", h6Values[i]);
    }
  } else {
    formData.append("departments[]", "");
  }
  const dataFormat = new URLSearchParams(formData);
  for (let [k, j] of formData) {
    //clear error
    console.log(k, j);
    const err = document.getElementById(`${k}_err`);
    err.textContent = "";
    err.style.display = "none";
  }

  try {
    const res = await fetch("/client/add-client", {
      method: "POST",
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
          if (k === "departments.0" || k === "departments") {
            k = "departments[]";
          }

          const err = document.getElementById(`${k}_err`);
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
      }, 700);
    }
  } catch (err) {
    console.error(err);
  }
});

addDepartmentBtn.addEventListener("click", () => {
  departmentName_err.textContent = "";
  departmentName_err.style.display = "hidden";
});

addNewDepartment.addEventListener("click", () => {
  if (!value.value == "") {
    const div = `<li class="d-flex mb-4 align-items-center">
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
                                  </div>
                                </div>
                              </li>`;

    document.querySelector("#closeDept").click();
    list.insertAdjacentHTML("afterbegin", div);
    value.value = "";
    const removeButtons = document.querySelectorAll(".removeButton");
    removeList(removeButtons);
  } else {
    departmentName_err.textContent = "Department name cannot be empty";
    departmentName_err.style.display = "block";
  }
});

function removeList(buttons) {
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (e.target.classList.contains("removeButton")) {
        // Get the parent <li> element that contains the item and button
        let listItem = e.target.closest("li");

        // Remove the <li> element from the list
        listItem.remove();
      }
    });
  });
}
