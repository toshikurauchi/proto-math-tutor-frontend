import { listExercises } from "./data/client";
import { renderExercise, renderExercises } from "./ui/layouts";
import { getIdFromURL } from "./data/query-string";
import { findExerciseById } from "./data/exercise";

function initialize() {
  const exerciseId = getIdFromURL();

  const mainContainer = document.querySelector(".ah-content");
  const container = mainContainer.querySelector("section");
  mainContainer.appendChild(container);

  listExercises().then((exercises) => {
    if (exerciseId === null) {
      renderExercises(container, exercises);
    } else {
      renderExercise(container, findExerciseById(exercises, exerciseId));
    }
  });
}

initialize();
