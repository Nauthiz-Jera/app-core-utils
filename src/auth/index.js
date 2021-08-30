const initialState = {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "login":
      return state;
    default:
      return state;
  }
};

export { authReducer };
