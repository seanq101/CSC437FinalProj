import React, {Component} from 'react';
import {ListGroup, Button} from 'react-bootstrap';
import {ConfDialog, EntItem} from '../components';
import EntModal from './EntModal';
import './Ent.css';


export default class MyEntsOverview extends Component {
   constructor(props) {
      super(props);
      this.props.getMyEntries(
         ents => {
            this.props.getBoards(this.props.Prss.id,
               boards => {
                  this.setState({'boards': boards})
               })
         }
      );

      this.state = {
         showModal: false,
         showConfirmation: false,
         boards: []
      }
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      this.setState({showModal: true, editCnv: cnv});
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         result.newEnt['ownerId'] = this.props.Prss.id
         result.newEnt['userName'] = this.props.Prss.firstName + ' ' + 
          this.props.Prss.lastName;
         this.newEnt(result.newEnt);
      }
      this.setState({ showModal: false });
   }


   newEnt(result) {
      this.props.addEntry(result);
   }

   openConfirmation = (cnv) => {
      this.setState({ delEnt: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if(res === "Yes"){
         this.props.delEnt(this.state.delEnt.id, 
            () => this.setState({showConfirmation: false, delEnt: null }));
      } else {
         this.setState({ showConfirmation: false, delEnt: null });
      }
      
   }

   openEdit = (cnv) => {
      this.setState({ delEnt: cnv, showConfirmation: true })
   }

   

   render() {
      console.log("Rerendering My Ents Overview ", this.props);
      var entries = [];
      this.props.Ents.forEach(ent => {
            entries.push(<EntItem
               key={ent.id}
               ownerId={ent.ownerId}
               title={ent.title}
               waveHeight={ent.waveHeight}
               content={ent.content}
               rating={ent.rating}
               loc={ent.loc}
               pub={ent.pub}
               whenSurfed={ent.whenSurfed}
               picURL={ent.picURL}
               id={ent.id}
               
               showControls={ent.ownerId === this.props.Prss.id || 
                this.props.Prss.role === 1}
               onDelete={() => this.openConfirmation(ent)}
                />);
      });

      return (
         <section className="container">
            <h1>My Journal Entries</h1>

            <ListGroup className="padded">
               {entries}
            </ListGroup>
            <Button variant="primary" onClick=
               {() => this.openModal()}>New Entry</Button>
            {/* Modal for creating and change cnv */}
            <EntModal
               showModal={this.state.showModal}
               onDismiss={this.modalDismiss} 
               boards={this.state.boards.boards}/>
            
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete Entry"
               body={`Are you sure you want to delete the Entry
           '${this.state.delEnt ? this.state.delEnt.title : ''}'`}
               buttons={['Yes', 'Abort']}
               onClose={this.closeConfirmation} />
         </section>
      )
   }
}
