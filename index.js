
// action.types
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const TOGGLE_GOAL = "TOGGLE_GOAL";

// reducer actions
const idGenerator = () =>
  Math.random().toString(32).substring(2) + new Date().getTime().toString(36);
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}
function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}
function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}
function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}
function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}
function toggleGoalAction(id) {
  return {
    type: TOGGLE_GOAL,
    id,
  };
}

//  App Code --todo reducer
function todo(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) => {
        return todo.id !== action.id
          ? todo
          : Object.assign({}, todo, {
              isCompleted: !todo.isCompleted,
            });
      });

    default:
      return state;
  }
}

// goal reducer
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    case TOGGLE_GOAL:
      return state.map((goal) =>
        goal.id === action.id
          ? goal
          : Object.assign({}, goal, {
              isCompleted: !goal.isCompleted,
            })
      );
    default:
      return state;
  }
}
// super reducer
function app(state = {}, action) {
  return {
    todos: todo(state.todos, action),
    goals: goals(state.goals, action),
  };
}
// store
const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("Nope!! That is a bad idea!");
  }
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes("bitcoin")
  ) {
    return alert("Nope!! That is a bad idea!");
  }
  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  const result = next(action);
  // console.log("The current state is: ", store.getState());
  console.groupEnd();
  return result;
};
// const app = Redux.combineReducers({ todos, goals });
const store = Redux.createStore(app, Redux.applyMiddleware(checker, logger));



