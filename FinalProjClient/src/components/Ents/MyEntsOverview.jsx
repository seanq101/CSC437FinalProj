import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ListGroup, ListGroupItem, Col, Row, Button} from 'react-bootstrap';
import {ConfDialog, EntItem} from '../components';
import EntModal from './EntModal';
import './Ent.css';


export default class MyEntsOverview extends Component {
   constructor(props) {
      super(props);
      this.props.getMyEntries();
      this.state = {
         showModal: false,
         showConfirmation: false,
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
          this.props.Prss.firstName;
         console.log('in overview', result.newEnt)
         this.newEnt(result.newEnt);
      }
      this.setState({ showModal: false });
   }

   modCnv(result) {
      this.props.modCnv(this.state.editCnv.id, result.title);
      this.props.updateCnvs();
   }

   newEnt(result) {
      this.props.addEntry(result);
   }

   openConfirmation = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true })
   }

   closeConfirmation = (res) => {
      if(res === "Yes"){
         this.props.delCnv(this.state.delCnv.id);
         //this.props.updateCnvs();
         this.setState({showConfirmation: false, delCnv: null });
      } else {
         console.log(res)
         this.setState({ showConfirmation: false, delCnv: null });
      }
      
   }

   openEdit = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true })
   }

   

   render() {
      console.log("Rerendering My Ents Overview ", this.props);
      var entries = [];
      console.log(this.props.Ents)
      this.props.Ents.forEach(ent => {
         //if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
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
               onEdit={() => this.openModal(ent)} />);
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
               onDismiss={this.modalDismiss} />
            
            <ConfDialog
               show={this.state.showConfirmation}
               title="Delete Conversation"
               body={`Are you sure you want to delete the Conversation
           '${this.state.delCnv ? this.state.delCnv.title : ''}'`}
               buttons={['Yes', 'Abort']}
               onClose={this.closeConfirmation} />
         </section>
      )
   }
}
