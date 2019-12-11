import { combineReducers } from 'redux';

import Prss from './Prss';
import Cnvs from './Cnvs';
import Errs from './Errs';
import Msgs from './Msgs';
import Ents from './Ents';
import Boards from './Boards';

const rootReducer = combineReducers({Prss, Cnvs, Errs, Msgs, Ents, Boards});

export default rootReducer;