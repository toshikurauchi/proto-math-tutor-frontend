import { MathfieldElement, convertLatexToMarkup } from "mathlive";

export function createEquationNode(history, equation, success, feedback) {
  if (success === undefined) success = true;

  const prevNodes = history.getElementsByClassName("equation-node");
  if (prevNodes.length > 0) {
    const prevOk =
      !prevNodes[prevNodes.length - 1].classList.contains("equation-disabled");
    createNodeLink(history, prevOk, success);
  }

  const node = document.createElement("div");
  node.classList.add("equation-node");
  if (!success) {
    disableNode(node);
  }
  if (equation) {
    node.innerHTML = convertLatexToMarkup(equation);
  }
  history.appendChild(node);

  addFeedbackToNode(feedback, node, success);

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
    addFeedbackToNode("Resolva primeiro as potências", node, success);
    if (!success) {
      disableNode(node);
    }

    fixPrevLink(node, success);

    const editableNode = createEditableNode(history, answer);
    setTimeout(() => {
      editableNode.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  });
  node.appendChild(testButton);

  return node;
}

function createNodeLink(history, prevOk, currOk) {
  const link = document.createElement("div");
  link.classList.add("equation-link");
  addLinkTransitionClass(link, prevOk, currOk);
  history.appendChild(link);
}

function addLinkTransitionClass(link, prevOk, currOk) {
  const transitionClassName = `from-${prevOk ? "success" : "fail"}-to-${
    currOk ? "success" : "fail"
  }`;
  link.classList.add(transitionClassName);
}

function addFeedbackToNode(feedback, node, success) {
  if (feedback) {
    const feedbackNode = document.createElement("span");
    feedbackNode.textContent = feedback;
    feedbackNode.classList.add("equation-feedback");
    if (success) {
      feedbackNode.classList.add("equation-ok");
    } else {
      feedbackNode.classList.add("equation-fail");
    }
    node.appendChild(feedbackNode);
  }
}

function disableNode(node) {
  node.classList.add("equation-disabled");

  node.classList.add("collapsed");
  node.addEventListener("click", () => {
    node.classList.toggle("collapsed");
  });
}

function fixPrevLink(node, currOk) {
  const link = node.previousSibling;
  const prevNode = link.previousSibling;
  const prevOk = !prevNode.classList.contains("equation-disabled");

  if (!prevOk && !prevNode.classList.contains("collapsed")) {
    prevNode.classList.add("collapsed");
  }

  [
    "from-success-to-success",
    "from-success-to-fail",
    "from-fail-to-success",
    "from-fail-to-fail",
  ].map((className) => link.classList.remove(className));

  addLinkTransitionClass(link, prevOk, currOk);
}
