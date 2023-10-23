"use strict";

const successNotification = document.querySelector("#success-notification");

function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    fetch(`/user/user-list/${id}`, {
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
