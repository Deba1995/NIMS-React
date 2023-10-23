"use strict";

const form = document.querySelector("#formUser");
const successNotification = document.querySelector("#success-notification");
const uploadProfile = document.getElementById("upload-profile");
const profileInput = document.getElementById("profile-input");
const profileDefault = document.getElementById("profile_default");

uploadProfile.addEventListener("click", () => {
  profileInput.click(); // Trigger the file input when the SVG is clicked
});

profileInput.addEventListener("change", () => {
  displayProfilePicture(profileInput);
});

// Function to display the selected profile picture
function displayProfilePicture(input) {
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      profileDefault.src = e.target.result;
    };

    reader.readAsDataURL(file);
  } else {
    profileDefault.src = "../../assets/images/avatars/01.png";
  }
}

// Get references to the select elements
const departmentSelect = document.getElementById("dept");
const designationSelect = document.getElementById("desg");

// Function to update designation options based on selected department
function updateDesignationOptions() {
  const selectedDepartment = departmentSelect.value;

  const designationData = JSON.parse(departmentSelect.dataset.doc);
  const groupedData = {};

  designationData.forEach((item) => {
    const { departmentCode, designationName, designationCode } = item;

    if (!groupedData[departmentCode]) {
      groupedData[departmentCode] = [];
    }

    groupedData[departmentCode].push({
      designationName,
      designationCode,
    });
  });

  const designations = groupedData[selectedDepartment];
  //Clear existing designation options
  designationSelect.innerHTML = "";

  //Add new designation options
  if (designations) {
    designations.forEach((designation) => {
      const option = document.createElement("option");
      option.value = designation.designationCode;
      option.textContent = designation.designationName;
      designationSelect.appendChild(option);
    });
  }
}

departmentSelect.addEventListener("change", updateDesignationOptions);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  for (let [k, j] of formData) {
    //clear error
    console.log(k, j);
    const err = document.getElementById(`${k}_err`);
    err.textContent = "";
    err.style.display = "none";
  }
  try {
    const res = await fetch("/user/add-user", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.errors) {
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
    if (data.user) {
      successNotification.style.display = "block";
      setTimeout(() => {
        successNotification.style.display = "none";
        location.assign(data.location);
      }, 400);
    }
  } catch (err) {
    console.error(err);
  }
});
