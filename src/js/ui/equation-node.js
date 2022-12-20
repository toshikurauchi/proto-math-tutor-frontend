import { createElement, scrollIntoView } from "./html-utils";
import { MathfieldElement, convertLatexToMarkup } from "mathlive";
import { getHint, postSolution } from "../data/client";
import { getIdFromURL } from "../data/query-string";

export function createEquationNode(history, currentState, equation) {
  addNodeLink(history);

  const node = createElement("div", history, { classNames: ["equation-node"] });
  const content = createElement("div", node, {
    classNames: ["equation-content"],
    html: equation && convertLatexToMarkup(equation),
    data: {
      state: currentState,
    },
  });

  return [node, content];
}

export function createEditableNode(history, currentState, prevAnswer) {
  const [node, contentNode] = createEquationNode(history, currentState);

  createElement("span", contentNode, {
    text: "Modifique o campo abaixo com o próximo passo:",
  });

  const mfe = new MathfieldElement({ virtualKeyboardMode: "manual" });
  mfe.value = prevAnswer;
  contentNode.appendChild(mfe);

  const feedbackNode = addFeedbackElement(contentNode);

  const [errorCounter, errorList] = addErrorCount(node);
  const hintButton = addHintButton(contentNode, currentState);
  const testButton = createElement("button", contentNode, {
    classNames: ["test-equation-btn"],
    text: "Testar",
  });
  testButton.disabled = true;
  testButton.addEventListener(
    "click",
    buildTestButtonClickHandler(
      errorCounter,
      errorList,
      mfe,
      feedbackNode,
      contentNode,
      history,
      hintButton
    )
  );

  mfe.addEventListener("input", () => {
    testButton.disabled = mfe.value === prevAnswer;
  });

  return node;
}

function buildTestButtonClickHandler(
  errorCounter,
  errorList,
  mfe,
  feedbackNode,
  contentNode,
  history,
  hintButton
) {
  return () => {
    const answer = mfe.value;

    const currentState = parseInt(contentNode.getAttribute("data-state"));
    checkAnswer(answer, currentState).then((result) => {
      const feedback = result?.message || "Ocorreu um erro no servidor";
      const nextState = result?.new_state || currentState;
      const correct = !!result?.correct;
      const finish = !!result?.finish;
      const normalizedAnswer = result?.response || answer;

      if (correct) {
        hintButton.classList.add("hidden");
        contentNode.innerHTML = convertLatexToMarkup(answer);
        if (finish) {
          const endNode = createEndNode(history);
          scrollIntoView(endNode);
        } else {
          const editableNode = createEditableNode(
            history,
            nextState,
            normalizedAnswer
          );
          scrollIntoView(editableNode);
        }
      } else {
        hintButton.classList.remove("hidden");
        increaseErrorCount(errorCounter);
        feedbackNode.textContent = feedback;
        addErrorFeedback(errorList, answer, feedback);
      }
    });
  };
}

function increaseErrorCount(errorCounter) {
  errorCounter.textContent = parseInt(errorCounter.textContent) + 1;
  errorCounter.classList.remove("hidden");
}

function addNodeLink(parent) {
  const prevNodes = parent.getElementsByClassName("equation-node");
  if (prevNodes.length === 0) return;

  createElement("div", parent, { classNames: ["equation-link"] });
}

function addFeedbackElement(parent) {
  return createElement("span", parent, { classNames: ["equation-feedback"] });
}

function addHintButton(parent, currentState) {
  const hintDialog = createDialog(parent, "Dica");
  const hintParagraph = createElement("p", hintDialog);
  const hintButton = createElement("button", parent, {
    classNames: ["hint-btn", "hidden"],
    text: "Quero uma dica",
  });

  hintButton.addEventListener("click", () => {
    if (typeof hintDialog.showModal === "function") {
      const exerciseId = getIdFromURL();
      getHint(exerciseId, 0).then((hint) => {
        hintParagraph.innerText = hint?.message || "Não há dicas disponíveis";
        hintDialog.showModal();
      });
    }
  });

  return hintButton;
}

function addErrorCount(parent) {
  const [dialog, errorList] = addErrorDialog(parent);

  const counter = createElement("button", parent, {
    classNames: ["counter-btn", "hidden"],
    text: "0",
  });
  counter.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  });

  return [counter, errorList];
}

function addErrorDialog(parent) {
  const dialog = createDialog(parent, "Tentativas");
  const errorList = createElement("ul", dialog, { classNames: ["error-list"] });

  return [dialog, errorList];
}

function createDialog(parent, title) {
  const dialog = createElement("dialog", parent, {
    classNames: ["dialog"],
  });

  createElement("p", dialog, {
    classNames: ["dialog-title"],
    text: title,
  });

  const closeButton = createElement("button", dialog, {
    classNames: ["close-btn"],
    html: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  return dialog;
}

function addErrorFeedback(errorList, answer, feedback) {
  const error = createElement("li", errorList);

  createElement("span", error, {
    classNames: ["error-list-answer"],
    html: convertLatexToMarkup(answer),
  });
  createElement("span", error, {
    classNames: ["error-list-feedback"],
    text: feedback,
  });
}

function checkAnswer(currentAnswer, stateId) {
  const exerciseId = getIdFromURL();
  return postSolution(exerciseId, stateId, currentAnswer);
}

function createEndNode(history) {
  createElement("div", history, { classNames: ["equation-link", "to-end"] });
  const endNode = createElement("div", history, {
    classNames: ["end-node"],
    text: "✓",
  });
  return endNode;
}
