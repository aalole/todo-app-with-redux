//  Library Code
// function createStore(reducer) {
//   // the state tree
//   // a way to get the state tree
//   // a way to listen and respond to the state changing
//   // a way to update the state
//   let listeners = [];
//   let state;
//   const getState = () => state;
//   const subscribe = (listener) => {
//     listeners.push(listener);
//     return () => listeners.filter((ls) => ls !== listener);
//   };

//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach((listener) => listener());
//   };
//   return {
//     getState,
//     subscribe,
//     dispatch,
//   };
// }

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
  console.log("The action is :", action);
  console.log("The current state is: ", store.getState());
  console.groupEnd();
  return result;
};
// const app = Redux.combineReducers({ todos, goals });
const store = Redux.createStore(app, Redux.applyMiddleware(checker, logger));
store.subscribe(() => {
  const { goals, todos } = store.getState();

  document.getElementById("todos").innerHTML = "";
  document.getElementById("goals").innerHTML = "";
  todos.forEach(populateTodo);

  goals.forEach(populateGoal);
});

// UI add Todo method
function addTodo() {
  const todo = document.getElementById("todo");
  const name = todo.value;
  todo.value = "";
  store.dispatch(
    addTodoAction({
      name,
      id: idGenerator(),
      isCompleted: false,
    })
  );
}

// UI ADD GOAL METHOD
function addGoal() {
  const input = document.getElementById("goal");
  const name = input.value;
  input.value = "";
  store.dispatch(
    addGoalAction({
      name,
      id: idGenerator(),
      isCompleted: true,
    })
  );
}

const todoBtn = document
  .getElementById("todoBtn")
  .addEventListener("click", addTodo);

const goalBtn = document
  .getElementById("goalBtn")
  .addEventListener("click", addGoal);

// REMOVE BUTTON CREATOR
const createRemoveButton = (onClick) => {
  const removeButton = document.createElement("button");
  removeButton.innerText = "X";
  removeButton.addEventListener("click", onClick);
  return removeButton;
};

// ADDING TODO TO UI
function populateTodo(todo) {
  const listItem = document.createElement("li");
  const text = document.createTextNode(todo.name);

  const itemRemoval = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  listItem.appendChild(text);
  listItem.appendChild(itemRemoval);

  const todoUl = document.getElementById("todos");
  todoUl.appendChild(listItem);
  listItem.style.textDecoration = todo.isCompleted ? "line-through" : "none";
  listItem.addEventListener("click", () => {
    store.dispatch(toggleTodoAction(todo.id));
  });
}

// ADD GOAL ITEM TO UI
function populateGoal(goal) {
  const listItem = document.createElement("li");
  const text = document.createTextNode(goal.name);
  const goalItemRemoval = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });
  listItem.appendChild(text);
  listItem.appendChild(goalItemRemoval);
  const goalUl = document.getElementById("goals");
  goalUl.append(listItem);
  listItem.style.textDecoration = goal.isCompleted ? "line-through" : "none";
  listItem.addEventListener("click", () => {
    store.dispatch(toggleGoalAction(goal.id));
  });
}

// function markAsCompleted() {
//   const todoItems = document.querySelectorAll("li");
//  todoItems.forEach((todo) => {
//     if (todo.isCompleted === true) {
//       todo.classList.add("completed");
//     }
//   });
// }

// myTodos.forEach((el) => {
//   el.addEventListener("click", markAsCompleted);
// });
// dispatch methods
// store.dispatch(
//   addTodoAction(ADD_TODO, {
//     id: 0,
//     name: "Walk the dog",
//     complete: false,
//   })
// );

// store.dispatch(
//   addTodoAction(ADD_TODO, {
//     id: 1,
//     name: "Wash the car",
//     complete: false,
//   })
// );

// store.dispatch(
//   addTodoAction(ADD_TODO, {
//     id: 2,
//     name: "Go to the gym",
//     complete: true,
//   })
// );

// store.dispatch(removeTodoAction(REMOVE_TODO, 1));

// store.dispatch(toggleTodoAction(TOGGLE_TODO, 1));

// store.dispatch(
//   addGoalAction(ADD_GOAL, {
//     id: 0,
//     name: "Learn Redux",
//   })
// );

// store.dispatch({
//   type: ADD_GOAL,
//   goal: {
//     id: 1,
//     name: "Lose 20 pounds",
//   },
// });

// store.dispatch(removeGoalAction(REMOVE_GOAL, 1));
