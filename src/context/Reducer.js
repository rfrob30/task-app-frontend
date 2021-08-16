export const initState = { taskList: [], summary: {} };

export function reducer(state, action) {
  switch (action.type) {
    case "setSummary":
      return {
        ...state,
        summary: action.summary,
      };
    case "setTaskList":
      return {
        ...state,
        taskList: action.taskList,
      };
    case "add":
      state.taskList.unshift(action.newTask);
      state.summary = recalculateSummary(state);

      return {
        ...state,
      };
    case "delete":
      state.taskList = state.taskList.filter((e) => e._id !== action.id);
      state.summary = recalculateSummary(state);

      return {
        ...state,
      };
    case "update":
      const index = state.taskList
        .map((task) => {
          return task._id;
        })
        .indexOf(action.newTask._id);

      state.taskList[index] = action.newTask;
      state.summary = recalculateSummary(state);

      return {
        ...state,
      };
    default:
      return state;
  }
}

const recalculateSummary = (state) => {
  const summary = state.summary;
  const completedTasks = state.taskList.filter((e) => e.completed);

  summary.tasksCompleted = completedTasks.length;
  summary.totalTasks = state.taskList.length;
  summary.latestTasks = state.taskList.slice(0, 3);

  return summary;
};
