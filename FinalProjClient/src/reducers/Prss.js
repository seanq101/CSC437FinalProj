function Prss(state = {}, action) {
   console.log("Prss reducing action " + action.type);
   switch(action.type) {
   case 'SIGN_IN':
      return action.user;
   case 'SIGN_OUT':
      return {}; // Clear user state
   case 'SIGN_IN_ERR':
      return action;
   default:
      return state;
   }
}

export default Prss;