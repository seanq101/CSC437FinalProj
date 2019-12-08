export default function Msgs(state = [], action) {
   console.log("Msgs reducing action " + action.type);
   switch (action.type) {
      case 'GET_MSGS':
         return action.msgs;
      case 'ADD_MSG':
         //action.msg.id = state[state.length - 1].id + 1
         return state.concat([action.msg]);
      default:
         return state;
   }
}
