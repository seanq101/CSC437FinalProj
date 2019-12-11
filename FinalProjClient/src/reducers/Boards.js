export default function Boards(state = [], action) {
   console.log("Boards reducing action " + action.type);
   switch (action.type) {
      case 'GET_BOARDS':
         return action.boards;
      case 'ADD_BOARD':
         return state.concat([action.board]);
      default:
         return state;
   }
}
