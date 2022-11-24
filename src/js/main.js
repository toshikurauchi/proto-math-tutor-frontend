import { createEditableNode, createEquationNode } from "./equation-node";

function onLoad() {
  const history = document.getElementById("equation-history");
  createEquationNode(history, question);
  createEditableNode(history, question);
}

if (document.readyState !== "loading") {
  onLoad();
} else {
  document.addEventListener("DOMContentLoaded", onLoad);
}
