// action.types
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const TOGGLE_GOAL = "TOGGLE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";
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

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
  };
}


function handleIntialData(){
  return async (dispatch) => {
   const [todos, goals] = await Promise.all([
      API.fetchTodos(),
      API.fetchGoals()
    ]);
    dispatch(receiveDataAction(todos, goals)); 
  }
}

function handleDeleteTodo(todo) {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodoAction(todo));
      alert("An error occured. Please try again later");
    });
  };
}

function handleAddTodo(name, cb) {
  return (dispatch) => {
    return API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodoAction(todo));
        cb();
      })
      .catch(() => alert("Something went wrong"));
  };
}

function handleToggle(id){
  return (dispatch) => {
    return API.saveTodoToggle(id).catch( () => {
      dispatch(toggleTodoAction(id))
      alert('an error occured!')
  })
  }
} 

function handleAddGoal(name, cb) {
  return (dispatch) => {
    return API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoalAction(goal));
        cb();
      })
      .catch(() => alert("something went wrong"));
  };
}

function handleDeleteGoal(goal) {
  return (dispatch) => {
    dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal));
      alert("Action not completed. Please try again!");
    });
  };
}
//  App Code --todo reducer
function todos(state = [], action) {
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
    case RECEIVE_DATA:
      return action.todos;
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
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

// super reducer
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
    loading: loading(state.loading, action),
  };
}
// store
const checker = () => (next) => (action) => {
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

const logger = () => (next) => (action) => {
  const result = next(action);
  console.groupEnd();
  return result;
};

// const thunk = (store) => (next) => (action) => {
//   if(typeof action === 'function'){
//     return action(store.dispatch)
//   }
//   return next(action)
// }
// const app = Redux.combineReducers({ todos, goals });
const store = Redux.createStore(
  app,
  Redux.applyMiddleware(ReduxThunk.default, checker, logger)
);
