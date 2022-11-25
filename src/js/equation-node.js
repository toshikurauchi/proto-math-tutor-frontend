import { MathfieldElement, convertLatexToMarkup } from "mathlive";

export function createEquationNode(history, equation) {
  addNodeLink(history);

  const node = document.createElement("div");
  node.classList.add("equation-node");

  const content = document.createElement("div");
  content.classList.add("equation-content");
  if (equation) {
    content.innerHTML = convertLatexToMarkup(equation);
  }
  node.appendChild(content);

  history.appendChild(node);

  return [node, content];
}

export function createEditableNode(history, prevAnswer) {
  const [node, contentNode] = createEquationNode(history);

  const label = document.createElement("span");
  label.textContent = "Modifique o campo abaixo com o próximo passo:";
  contentNode.appendChild(label);

  const mfe = new MathfieldElement({ virtualKeyboardMode: "manual" });
  mfe.value = prevAnswer;
  contentNode.appendChild(mfe);

  const feedbackNode = addFeedbackElement(contentNode);

  let errorCounter;
  let errorList;
  const testButton = document.createElement("button");
  testButton.classList.add("test-equation-btn");
  testButton.textContent = "Testar";
  testButton.addEventListener("click", () => {
    const answer = mfe.value;
    const success = checkAnswer(answer);
    if (success) {
      contentNode.innerHTML = convertLatexToMarkup(answer);
      const editableNode = createEditableNode(history, answer);
      // Postpone scrollIntoView so the node has time to be initialized
      setTimeout(() => {
        editableNode.scrollIntoView({
          behavior: "smooth",
        });
      }, 0);
    } else {
      if (!errorCounter) {
        [errorCounter, errorList] = addErrorCount(node);
      }
      errorCounter.textContent = parseInt(errorCounter.textContent) + 1;
      const newFeedback = randomFeedback();
      feedbackNode.textContent = newFeedback;
      addErrorFeedback(errorList, answer, newFeedback);
    }
  });
  contentNode.appendChild(testButton);

  mfe.addEventListener("input", () => {
    prevAnswer;
  });

  return node;
}

function addNodeLink(parent) {
  const prevNodes = parent.getElementsByClassName("equation-node");
  if (prevNodes.length === 0) return;

  const link = document.createElement("div");
  link.classList.add("equation-link");
  parent.appendChild(link);
}

function addFeedbackElement(parent) {
  const feedbackNode = document.createElement("span");
  feedbackNode.classList.add("equation-feedback");
  parent.appendChild(feedbackNode);

  return feedbackNode;
}

function addErrorCount(parent) {
  const [dialog, errorList] = addErrorDialog(parent);

  const counter = document.createElement("button");
  counter.classList.add("counter-btn");
  counter.textContent = 0;
  counter.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  });
  parent.appendChild(counter);

  return [counter, errorList];
}

function addErrorDialog(parent) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("error-dialog");

  const errorList = document.createElement("ul");
  errorList.classList.add("error-list");
  dialog.appendChild(errorList);

  const closeButton = document.createElement("button");
  closeButton.innerHTML =
    '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
  dialog.appendChild(closeButton);

  parent.appendChild(dialog);

  return [dialog, errorList];
}

function addErrorFeedback(errorList, answer, feedback) {
  const error = document.createElement("li");

  const answerElement = document.createElement("span");
  answerElement.classList.add("error-list-answer");
  answerElement.innerHTML = convertLatexToMarkup(answer);
  error.appendChild(answerElement);

  const feedbackElement = document.createElement("span");
  feedbackElement.classList.add("error-list-feedback");
  feedbackElement.textContent = feedback;
  error.appendChild(feedbackElement);

  errorList.appendChild(error);
}

function checkAnswer(currentAnswer) {
  return false;
  return Math.random() < 0.1;
}

function randomFeedback() {
  const feedbacks = [
    "Resolva primeiro as potências",
    "Verifique os sinais",
    "Resolva primeiro os parênteses",
  ];
  const randomIdx = Math.floor(Math.random() * feedbacks.length);
  return feedbacks[randomIdx];
}
