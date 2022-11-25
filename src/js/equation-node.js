import { MathfieldElement, convertLatexToMarkup } from "mathlive";

export function createEquationNode(history, equation, feedback) {
  createNodeLink(history);

  const node = document.createElement("div");
  node.classList.add("equation-node");
  if (equation) {
    node.innerHTML = convertLatexToMarkup(equation);
  }
  history.appendChild(node);

  addFeedbackToNode(feedback, node);

  return node;
}

export function createEditableNode(history, prevAnswer) {
  const node = createEquationNode(history);

  const label = document.createElement("span");
  label.textContent = "Modifique o campo abaixo com o próximo passo:";
  node.appendChild(label);

  const mfe = new MathfieldElement({ virtualKeyboardMode: "manual" });
  mfe.value = prevAnswer;
  node.appendChild(mfe);

  const testButton = document.createElement("button");
  testButton.classList.add("test-equation-btn");
  testButton.textContent = "Testar";
  testButton.addEventListener("click", () => {
    const answer = mfe.value;
    const success = false; // TODO: THIS SHOULD BE COMPUTED SOMEWHERE ELSE;
    node.innerHTML = convertLatexToMarkup(answer);
    addFeedbackToNode("Resolva primeiro as potências", node);

    const editableNode = createEditableNode(history, answer);
    // Postpone scrollIntoView so the node has time to be initialized
    setTimeout(() => {
      editableNode.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  });
  node.appendChild(testButton);

  mfe.addEventListener("input", () => {
    prevAnswer;
  });

  return node;
}

function createNodeLink(history) {
  const prevNodes = history.getElementsByClassName("equation-node");
  if (prevNodes.length === 0) return;

  const link = document.createElement("div");
  link.classList.add("equation-link");
  history.appendChild(link);
}

function addFeedbackToNode(feedback, node) {
  if (feedback) {
    const feedbackNode = document.createElement("span");
    feedbackNode.textContent = feedback;
    feedbackNode.classList.add("equation-feedback");
    node.appendChild(feedbackNode);
  }
}
