"use strict";

const form = document.getElementById(`formEditUser`);
const successNotification = document.querySelector("#success-notification");
const uploadProfile = document.getElementById("upload-profile");
const profileInput = document.getElementById("profile-input");
const profileDefault = document.getElementById("profile_default");

const designationsData = JSON.parse(desg.dataset.doc);

// Function to populate designation options based on department
function populateDesignationOptions(selectedDepartmentCode) {
  const designationSelect = document.getElementById("desg");
  designationSelect.innerHTML = ""; // Clear existing options

  // Filter designations based on the selected department code
  const filteredDesignations = designationsData.filter((designation) => {
    return designation.departmentCode === selectedDepartmentCode;
  });

  // Create and append options for filtered designations
  filteredDesignations.forEach((designation) => {
    const option = document.createElement("option");
    option.value = designation.designationCode;
    option.textContent = designation.designationName;
    designationSelect.appendChild(option);
  });
}

// Event listener for department select change
const departmentSelect = document.getElementById("dept");
departmentSelect.addEventListener("change", () => {
  const selectedDepartmentCode = departmentSelect.value;
  populateDesignationOptions(selectedDepartmentCode);
});

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

async function saveItem(id) {
  try {
    const formData = new FormData(form);
    for (let [k, j] of formData) {
      //clear error
      const err = document.getElementById(`edit_${k}_err`);
      err.textContent = "";
      err.style.display = "none";
    }

    const res = await fetch(`/user/user-profile/${id}`, {
      method: "PUT",
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

          const err = document.getElementById(`edit_${k}_err`);
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
      }, 600);
    }
  } catch (err) {
    console.log(err);
  }
}
