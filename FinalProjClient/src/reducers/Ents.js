export default function Ents(state = [], action) {
   console.log("Entry reducing action " + action.type);
   switch (action.type) {
      case 'GET_ENTS':
         return action.ents;
      case 'ADD_ENT':
         return state.concat([action.ent]);
      case 'DEL_ENT':
         console.log(state.filter(curEnt => curEnt.id !== action.ent))
         return state.filter(curEnt => curEnt.id !== action.ent)
      default:
         return state;
   }
}
