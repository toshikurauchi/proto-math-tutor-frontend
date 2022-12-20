export function findExerciseById(exercises, exerciseId) {
  for (let exercise of exercises) {
    if (exercise.id_exercise == exerciseId) return exercise;
  }
  return null;
}
