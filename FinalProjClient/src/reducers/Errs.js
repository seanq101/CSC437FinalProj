export default function Errs(state = [], action) {
   switch(action.type) {
   case 'LOGIN_ERR':
   case 'REGISTER_ERR':
   case 'ADD_ENT_ERR':
   case 'GET_ENT_ERR':
   case 'DEL_ENT_ERR':
   case 'GET_BOARDS_ERR':
   case 'ADD_BOARD_ERR':
   console.log("heres the deets",JSON.stringify(action.details));
      return state.concat(action.details);
   case 'CLEAR_ERRS':
      return [];
   default:
      return state;
   }
}
