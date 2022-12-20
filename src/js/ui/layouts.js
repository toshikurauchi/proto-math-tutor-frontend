import { convertLatexToMarkup } from "mathlive";
import { createEditableNode, createEquationNode } from "./equation-node";
import { clearContainer, createElement } from "./html-utils";

export function renderExercises(container, exercises) {
  clearContainer(container);

  createElement("h1", container, { text: "Exercícios" });
  createElement("p", container, {
    text: "Escolha o exercício:",
  });
  const exerciseUL = createElement("ul", container);
  exercises.forEach((exercise) => {
    const exerciseLI = createElement("li", exerciseUL);
    const link = createElement("a", exerciseLI, {
      html: convertLatexToMarkup(exercise.description),
    });
    link.setAttribute("href", `?exercise-id=${exercise.id_exercise}`);
  });
}

export function renderExercise(container, exercise) {
  clearContainer(container);

  createElement("h1", container, { text: "Exercícios" });
  createElement("p", container, {
    text: "Simplifique a expressão abaixo:",
  });
  const historyContainer = createElement("div", container, {
    id: "equation-history",
  });

  const question = exercise.description;
  createEquationNode(historyContainer, 0, question);
  createEditableNode(historyContainer, 0, question);
}
