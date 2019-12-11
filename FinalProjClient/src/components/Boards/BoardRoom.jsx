import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ListGroup, ListGroupItem, Col, Row, Button, Carousel} from 'react-bootstrap';
import {ConfDialog} from '../components';
import './BoardRoom.css'

export default class BoardRoom extends Component {
   constructor(props) {
      super(props);
      this.props.getBoards(this.props.Prss.id,
         boardsList => {
            let boardDict = {};
            this.props.getMyEntries(this.props.Prss.id, 
               entsList => {
                  entsList = entsList.ents;
                  console.log('entsList',entsList)
                  entsList.forEach(ent => {
                     if(boardDict[ent.boardId]){
                        boardDict[ent.boardId].push(ent);
                     } else {
                        boardDict[ent.boardId] = [ent]
                     }
                  });
                  console.log("boardDict", boardDict)
                  this.setState({boardDict: boardDict});
               });
         });
      this.state = {
         showModal: false,
         showConfirmation: false,
         boardDict: {}
      }
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv) => {
      this.setState({showModal: true, editCnv: cnv});
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editCnv)
            this.modCnv(result);
         else
            this.newCnv(result);
      }
      this.setState({ showModal: false, editCnv: null });
   }

   modCnv(result) {
      this.props.modCnv(this.state.editCnv.id, result.title);
      this.props.updateCnvs();
   }

   newCnv(result) {
      this.props.addCnv({ title: result.title });
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
      console.log("Rerendering Cnv Overview ", this.props);
      var boards = [];
      console.log(this.props.Cnvs)
      this.props.Boards.forEach(board => {
         if (!this.props.userOnly || this.props.Prss.id === board.prId)
            boards.push(
               <Carousel.Item>
                  <div className="carousel-pic">
                     <img 
                        className="d-block w-100"
                        src={board.picURL}
                        alt="First slide"
                     />
                  </div>
                  
                  <Carousel.Caption className="carousel-description">
                     <h3>{board.bName}</h3>
                     {this.state.boardDict[board.id] ? 
                        <div>
                           <p>
                              Number of Times Used: 
                              {this.state.boardDict[board.id].length}
                           </p>
                           <p>Biggest Wave Ridden: 
                              {this.state.boardDict[board.id].sort((a, b) => (a.waveHeight > b.waveHeight) ? -1 : 1)[0].waveHeight}
                           </p>

                           <p>
                              Last Recently Used:  
                              {new Intl.DateTimeFormat('us',
                                 {
                                    year: "numeric", month: "short", day: "numeric",
                                 })
                              .format(new Date(this.state.boardDict[board.id]
                               .sort((a, b) => (a.whenSurfed > b.whenSurfed) ?
                               -1 : 1)[0].whenSurfed))}
                           </p> 
                        </div>
                      : ''
                     }
                  </Carousel.Caption>
               </Carousel.Item>
            );
      });

      return (
         <section className="container">
            <h1 className="heading">My Boards</h1>

            <Carousel>
               {boards}
            </Carousel>

            
            <Button variant="primary" onClick=
               {() => this.openModal()}>Add A New Board</Button>
            {/* Modal for creating and change cnv */}
            
            
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

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row> 
            <Col sm={4} className="float-left">
               <Link to={"/CnvDetail/" + props.id}>{props.title}</Link>
            </Col>
            {
               props.lastMessage ? 
                  <Col sm={4} 
                   className="float-left">{new Intl.DateTimeFormat('us',
                  {
                     year: "numeric", month: "short", day: "numeric",
                     hour: "2-digit", minute: "2-digit", second: "2-digit"
                  })
                  .format(new Date(props.lastMessage))}
                  </Col> 
                  : 
                  <Col sm={4}> N/A </Col>
            }
            
            
            {props.showControls ?
               <Col sm={4} className="float-right right-text">
                  <Button size="sm" onClick={props.onDelete} 
                   className="favicon">
                     <span className="fa fa-trash"/>
                  </Button>
                  <Button size="sm" onClick={props.onEdit} className="favicon">
                     <span className="fa fa-edit"/>
                  </Button>
               </Col>
               : ''}
         </Row>
      </ListGroupItem>
   )
}
