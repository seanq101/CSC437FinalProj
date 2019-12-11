import { combineReducers } from 'redux';

import Prss from './Prss';
import Errs from './Errs';
import Ents from './Ents';
import Boards from './Boards';

const rootReducer = combineReducers({Prss, Errs, Ents, Boards});

export default rootReducer;