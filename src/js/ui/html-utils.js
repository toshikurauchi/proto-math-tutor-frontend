export function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

export function createElement(tagName, parent, config) {
  const element = document.createElement(tagName);
  if (parent) parent.appendChild(element);
  if (config) {
    if (config.text) {
      element.innerText = config.text;
    }
    if (config.html) {
      element.innerHTML = config.html;
    }
    if (config.id) {
      element.setAttribute("id", config.id);
    }
    if (config.classNames) {
      for (let className of config.classNames) {
        element.classList.add(className);
      }
    }
    if (config.data) {
      for (let attr in config.data) {
        element.setAttribute(`data-${attr}`, config.data[attr]);
      }
    }
  }

  return element;
}

export function scrollIntoView(element) {
  // Postpone scrollIntoView so the node has time to be initialized
  setTimeout(() => {
    element.scrollIntoView({
      behavior: "smooth",
    });
  }, 0);
}
