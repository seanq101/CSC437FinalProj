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

export function updateCnvs(userId, cb) {
   return (dispatch, prevState) => {
      api.getCnvs(userId)
      .then((cnvs) => dispatch({ type: 'UPDATE_CNVS', cnvs }))
      .then(() => {if (cb) cb();});
   };
}

export function addCnv(newCnv, cb) {
   return (dispatch, prevState) => {
      api.postCnv(newCnv)
      .then(cnvRsp => dispatch({type: 'ADD_CNV', cnv: cnvRsp}))
      .then(() => {if (cb) cb();});
   };
}

export function modCnv(cnvId, title, cb) {
   return (dispatch, prevState) => {
      api.putCnv(cnvId, {title})
      .then(() => {if (cb) cb();})
      .catch(err => dispatch({type:'ADD_CNV_ERR', details: err}));
   };
}

export function delCnv(id, cb) {
   return (dispatch, prevState) => {
      api.delCnv(id)
      .then(() => {dispatch({ type: 'DEL_CNV', cnv: id })})
      .then(() => {if (cb) cb();});
   };
}

export function updateMsgs(cnvId, cb) {
   return (dispatch, prevState) => {
      api.getMsgs(cnvId)
      .then(res => dispatch({type: 'GET_MSGS', msgs: res}))
      .then(() => {if (cb) cb();})
      .catch(err => dispatch({type: 'LOAD_MSGS_ERR', details: err}));
   };
}

export function addMsg(newMsg, cnvId, cb) {
   return (dispatch, prevState) => {
      api.postMsg(newMsg, cnvId)
      .then(res => dispatch({type: 'ADD_MSG', msg: res}))
      .then(() => {if (cb) cb();})
      .catch(err => dispatch({type: 'ADD_MSG_ERR', details: err}));
   };
}

export function getPerson(prsId, cb) {
   return (dispatch, prevState) => {
      api.getPerson(prsId)
      .then(res => {if (cb) cb(res[0]);});
   }; 
}

export function getMyEntries(prsId, cb) {
   return (dispatch, prevState) => {
      api.getMyEnts(prsId)
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

export function getPublicEntries(cb) {
   return (dispatch, prevState) => {
      api.getPublicEnts()
      .then(res => dispatch({type: 'GET_ENTS', ents : res}))
      .then(res => {if (cb) cb(res);});
   }; 
}
