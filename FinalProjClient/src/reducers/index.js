import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Errs from './Errs';
import Msgs from './Msgs';
import Ents from './Ents';

const rootReducer = combineReducers({Prss, Cnvs, Errs, Msgs, Ents});

export default rootReducer;