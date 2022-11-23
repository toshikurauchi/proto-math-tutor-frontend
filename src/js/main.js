import { MathfieldElement, convertLatexToMarkup } from "mathlive";

function onLoad() {
  const history = document.getElementById("equation-history");
  const container = document.createElement("div");
  container.classList.add("equation-container");
  container.innerHTML = convertLatexToMarkup(question);
  history.appendChild(container);

  const mfe = new MathfieldElement();
  mfe.value = question;
  history.appendChild(mfe);
}

if (document.readyState !== "loading") {
  onLoad();
} else {
  document.addEventListener("DOMContentLoaded", onLoad);
}
