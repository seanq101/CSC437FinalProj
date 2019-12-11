import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from './actions/actionCreators';
import Main from './components/Main/Main';

// State properties automatically passed to Main
function mapStateToProps(state) {
   console.log("State is " + JSON.stringify(state));
   console.log(Object.keys(state.Prss).length);
   console.log(Object.keys(state.Prss).length !== 0 );
   return {
      Prss: state.Prss,
      Cnvs: state.Cnvs,
      Errs: state.Errs,
      Msgs: state.Msgs,
      Ents: state.Ents,
      Boards: state.Boards
   };
}

// Function properties automatically passed to Main
function mapDispatchToProps(dispatch) {
   return bindActionCreators(actionCreators, dispatch);
}

const App = withRouter(connect(
   mapStateToProps,
   mapDispatchToProps
)(Main));


export default App;