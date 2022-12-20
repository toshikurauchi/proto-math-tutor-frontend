const API_URL = "http://18.208.13.53/api/v0.1/math-tutor";

export function listExercises() {
  // Response: [ { id_exercise: 0, description: "", equation: "" }]
  return getJSON(`${API_URL}/exercises/`, []);
}

export function getHint(exerciseId, hintId) {
  // Response: { id_exercise: 0, id_hint: 0, message: ""}
  return getJSON(`${API_URL}/exercises/${exerciseId}/${hintId}`, null);
}

export function postSolution(exerciseId, state, solution) {
  // Response: { id_exercise: 0, state: 0, correct: true, new_state: 0, message: "", finish: true, response: "" }
  return postJSON(`${API_URL}/exercises/${exerciseId}`, {
    id_exercise: exerciseId,
    state,
    solution,
  });
}

function getJSON(endpoint, defaultResponse) {
  return fetch(endpoint)
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return defaultResponse;
    });
}

function postJSON(endpoint, data) {
  return fetch(endpoint, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
}
