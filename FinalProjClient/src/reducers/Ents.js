export default function Ents(state = [], action) {
   console.log("Entry reducing action " + action.type);
   switch (action.type) {
      case 'GET_ENTS':
         return action.ents;
      case 'ADD_ENT':
         return state.concat([action.ent]);
      default:
         return state;
   }
}
