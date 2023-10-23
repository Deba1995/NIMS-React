const menuItem = document.querySelectorAll("a");
const currentlocation = location;

menuItem.forEach((item) => {
  if (item.href === currentlocation.href) {
    item.classList.add("active");
    currentActive = document.querySelector(
      `a.active[href="${item.href.replace("http://localhost:8180", "")}"]`
    );

    if (
      currentActive?.parentElement?.parentElement?.parentElement?.parentElement
        ?.previousElementSibling
    ) {
      const element =
        currentActive.parentElement.parentElement.parentElement.parentElement
          .previousElementSibling;
      const elementSibling = element.nextElementSibling;
      const ariaExpandedValue = element.getAttribute("aria-expanded");
      if (ariaExpandedValue === "false") {
        element.setAttribute("aria-expanded", "true");
        elementSibling.classList.add("show");
      }
    }
  }
});
