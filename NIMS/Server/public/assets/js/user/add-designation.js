"use strict";

const form = document.querySelector("#formDesignation");
const successNotification = document.querySelector("#success-notification");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //reset errors
  //    departmentError.textContent = '';
  const formData = new FormData(form);
  const dataFormat = new URLSearchParams(formData);
  for (let [k, j] of formData) {
    //clear error

    const err = document.getElementById(`${k}_err`);
    err.textContent = "";
    err.style.display = "none";
  }

  try {
    const res = await fetch("/user/add-designation", {
      method: "POST",
      body: dataFormat,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await res.json();
    if (data.errors) {
      console.log(data.errors);
      const entries = Object.entries(data.errors);
      for (let [k, v] of entries) {
        if (v != "") {
          if (k === "govId.image") {
            k = "govId";
          }

          const err = document.getElementById(`${k}_err`);
          err.textContent = v;
          err.style.display = "block";
        }
      }
    }
    if (data.designation) {
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

function editItem(id) {
  document.getElementById(`name_${id}`).style.display = "none";
  document.getElementById(`edit_${id}`).style.display = "inline";
  document.getElementById(`dept_${id}`).style.display = "none";
  document.getElementById(`edit_dept_${id}`).style.display = "inline";
  document.querySelector(
    `button[data-id="${id}"][data-action="edit"]`
  ).style.display = "none";
  document.querySelector(
    `button[data-id="${id}"][data-action="delete"]`
  ).style.display = "none";
  document.querySelector(
    `button[data-id="${id}"][data-action="save"]`
  ).style.display = "inline";
  document.querySelector(
    `button[data-id="${id}"][data-action="cancel"]`
  ).style.display = "inline";
}

function cancelItem(id) {
  document.getElementById(`name_${id}`).style.display = "inline";
  document.getElementById(`edit_${id}`).style.display = "none";
  document.getElementById(`dept_${id}`).style.display = "inline";
  document.getElementById(`edit_dept_${id}`).style.display = "none";
  document.getElementById(`edit_${id}designationName_err`).textContent = "";
  document.getElementById(`edit_${id}designationName_err`).style.display =
    "none";
  document.querySelector(
    `button[data-id="${id}"][data-action="edit"]`
  ).style.display = "inline";
  document.querySelector(
    `button[data-id="${id}"][data-action="delete"]`
  ).style.display = "inline";
  document.querySelector(
    `button[data-id="${id}"][data-action="save"]`
  ).style.display = "none";
  document.querySelector(
    `button[data-id="${id}"][data-action="cancel"]`
  ).style.display = "none";
}

function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    fetch(`/user/add-designation/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        successNotification.style.display = "block";
        setTimeout(() => {
          successNotification.style.display = "none";
          location.assign(data.location);
        }, 400);
      })
      .catch((err) => console.log(err));
  }
}

async function saveItem(id) {
  const newName = document.getElementById(`edit_${id}`).value;
  const newDept = document.getElementById(`edit_dept_${id}`).value;
  const formData = new FormData();
  formData.append("designationName", newName);
  formData.append("departmentCode", newDept);
  const dataFormat = new URLSearchParams(formData);

  try {
    const res = await fetch(`/user/add-designation/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: dataFormat,
    });
    const data = await res.json();
    if (data.errors) {
      const entries = Object.entries(data.errors);
      for (let [k, v] of entries) {
        if (v != "") {
          if (k === "govId.image") {
            k = "govId";
          }

          const err = document.getElementById(`edit_${id}${k}_err`);
          err.textContent = v;
          err.style.display = "block";
        }
      }
    }
    if (data.designation) {
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
