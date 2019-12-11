import * as api from '../api';

export function clearErrors() {
   return (dispatch, prevState) => {
      dispatch({type: "CLEAR_ERRS"});
   }
}

export function signIn(credentials, cb) {
   return (dispatch, prevState) => {
      api.signIn(credentials)
      .then((userInfo) => dispatch({type: "SIGN_IN", user: userInfo}))
      .then(() => {if (cb) cb();})
      .catch(err => {console.log('err is',err);dispatch({type: 'LOGIN_ERR', 
       details: err})});
   };
}

export function signOut(cb) {
   return (dispatch, prevState) => {
      api.signOut()
      .then(() => dispatch({ type: 'SIGN_OUT' }))
      .then(() => {if (cb) cb();});
   };
}

export function register(data, cb) {
   return (dispatch, prevState) => {
      api.register(data)
      .then(() => {if (cb) cb();})
      .catch(error => dispatch({type: 'REGISTER_ERR', details: error}));
   };
}

export function getPerson(prsId, cb) {
   return (dispatch, prevState) => {
      api.getPerson(prsId)
      .then(res => {if (cb) cb(res[0]);});
   }; 
}

export function getMyEntries(cb) {
   return (dispatch, prevState) => {
      api.getMyEnts()
      .then(res => dispatch({type: 'GET_ENTS', ents : res}))
      .then(res => {if (cb) cb(res);});
   }; 
}

export function addEntry(newEnt, cb) {
   console.log('in action creators', newEnt)
   return (dispatch, prevState) => {
      api.postEnt(newEnt)
      .then(res => dispatch({type: 'ADD_ENT', ent: res}))
      .then(() => {if (cb) cb();})
      .catch(err => dispatch({type: 'ADD_ENT_ERR', details: err}));
   };
}


export function addBoard(newB, cb) {
   console.log('in action creators', newB)
   return (dispatch, prevState) => {
      api.postBoard(newB)
      .then(res => dispatch({type: 'ADD_BOARD', board: res}))
      .then(() => {if (cb) cb();})
      .catch(err => dispatch({type: 'ADD_BOARD_ERR', details: err}));
   };
}


export function getPublicEntries(cb) {
   return (dispatch, prevState) => {
      api.getPublicEnts()
      .then(res => dispatch({type: 'GET_ENTS', ents : res}))
      .then(res => {if (cb) cb(res);})
      .catch(err => dispatch({type: 'GET_ENT_ERR', details: err}));
   }; 
}

export function getBoards(prsId, cb) {
   return (dispatch, prevState) => {
      api.getMyBoards(prsId)
      .then(res => dispatch({type: 'GET_BOARDS', boards : res}))
      .then(res => {if (cb) cb(res);})
      .catch(err => dispatch({type: 'GET_BOARDS_ERR', details: err}));
   }; 
}

export function delEnt(id, cb) {
   return (dispatch, prevState) => {
      api.delEnt(id)
      .then(() => {dispatch({ type: 'DEL_ENT', ent: id })})
      .then(() => {if (cb) cb();})
      .catch(err => dispatch({type: 'DEL_ENT_ERR', details: err}));
   };
}
