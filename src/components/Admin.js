import React from 'react';
import * as firebase from 'firebase';
import {getUsersData,startDeleteUser,startAddArea,getAreaData,startCancelBooking,getUsersFeedbackData} from '../actions/dataActions'
import {connect} from 'react-redux'
import '../App.css';
import CircularProgress from 'material-ui/CircularProgress';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { ValidatorForm } from 'react-form-validator-core';
import {RaisedButton,TextField,Paper,Divider,leftAvatar,Avatar} from 'material-ui'
import {List, ListItem} from 'material-ui/List';
// import FeedbackIcon from 'react-icons/lib/md/feedback'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {
    blue300,
    indigo900,
    orange200,
    deepOrange300,
    pink400,
    purple500,
} from 'material-ui/styles/colors';
const styles = {
    headline: {
      fontSize: 24,
      paddingTop: 16,
      marginBottom: 12,
      fontWeight: 400,
    },
    style : {
      height: 500,
      width: 400,
      marginTop:"5%",
      marginLeft:"40%",
      textAlign: 'center',
      display: 'inline-block',
      borderRadius:5
    },
    slide: {
      padding: 10,
    },
    customWidth: {
        width: 350,
      },
      styleArea:{
        marginTop: 50,
        marginLeft:40,
        marginRight: 40,
        marginBottom: 15
    },
      stylePlace:{
        marginTop: 0,
        marginLeft:40,
        marginRight: 40,
        marginBottom: 0
    },
    styleSlots:{
      marginTop: 15,
      marginLeft:40,
      marginRight: 40,
      marginBottom: 0
  },
      styleButton:{
        marginTop: 20
      },
  };
class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            slideIndex: 0,
            displayName:'',
            userUid:'',
            area:'',
            place:'',
            slots:''
          };
          
    }
    componentWillMount(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            this.setState({
              displayName:user.displayName
            })
        }
    });
        {this.props.getUsersData({
          stu:"From Admin Dispatch"
        })}
        {this.props.getAreaData({
          Admin:"From admin Dispatch"
        })}
        {this.props.getUsersFeedbackData({
          Admin:"From admin Dispatch"
        })}
    } 
      componentDidMount(){
        localStorage.setItem("type", JSON.stringify("/admin"))
      }
      handleChange = (value) => {
        this.setState({
          slideIndex: value,
        });
      };
    
  deleteUser(uid){
    this.props.startDeleteUser({
      userUid:uid
    })
  }
  cancelBooking(cancelIndex,pushKey,bookingPushKey){
    console.log(cancelIndex,pushKey,bookingPushKey)
  this.props.startCancelBooking({
    cancelIndex:cancelIndex,
    pushKey:pushKey,
    bookingPushKey:bookingPushKey
  })
}
  addArea=()=>{
    if(this.state.area === '' && this.state.place=== '')
    {
      alert("Please fill the fields!")
    }
    else if(this.state.slots >50){
        alert("You can't add slots more than 50")
      }
      else if(this.state.slots <=0){
        alert("Slots must be greater than zero ")
      }
    else{
      this.props.startAddArea({
        area:this.state.area,
        place:this.state.place,
        slots:this.state.slots
      })
      this.setState({
        area:'',
        place:'',
        slots:''
      })
    }
}
render(){
      return (
            <div className="adminBackground" style={{width:"100%",height:900}}>
            <div style={{height:"40px",color:"black",backgroundColor:"lightBlue",marginTop:"-24px"}}>
                <center>
                  <p style={{fontSize:"24px"}}>{`Welcome ${this.state.displayName}`}</p>
                </center>
            </div>
            <div>
            <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
            >
          <Tab label="View Bookings" value={0} />
          <Tab label="Users" value={1} />
          <Tab label="Users Feedback" value={2} />
          <Tab label="Add Parking Areas" value={3} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
            <Table >
                  {
                   this.props.parkingArea?
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                      <TableRow style={{textAlign:"center"}}>
                         <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Slots</TableHeaderColumn>
                        <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Area</TableHeaderColumn>
                        <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Place</TableHeaderColumn>
                        <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Date</TableHeaderColumn>
                        <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Star Time</TableHeaderColumn>
                        <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>End Time</TableHeaderColumn>
                        <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Cancel Booking</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>:<p style={{color:"red",marginLeft:"45%"}}>No Bookings</p>
                    }
                    <TableBody stripedRows={true} displayRowCheckbox={false}>
                                { (this.props.parkingArea)?
                                  this.props.parkingArea.map((parking)=>{
                                    return(
                                      parking.Slots?parking.Slots.map((slotRef,index)=>{
                                          return(
                                            slotRef.Bookings?Object.keys(slotRef.Bookings).map((slot)=>{
                                                if(slotRef.Bookings[slot].booked === "true"){
                                                    let startTimeHours=new Date(slotRef.Bookings[slot].startTime).getHours()
                                                    let startTimeMinutes=new Date(slotRef.Bookings[slot].startTime).getMinutes()
                                                    let endTimeHours=new Date(slotRef.Bookings[slot].endTime).getHours()
                                                    let endTimeMinutes=new Date(slotRef.Bookings[slot].endTime).getMinutes()
                                                return(
                                                    <TableRow key={index}>
                                                        <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{index+1}</TableRowColumn>
                                                        <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{slotRef.Bookings[slot].parkingArea}</TableRowColumn>
                                                        <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{slotRef.Bookings[slot].parkingPlace}</TableRowColumn>
                                                        <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{slotRef.Bookings[slot].bookingDay}/{slotRef.Bookings[slot].bookingMonth+1}/
                                                        {slotRef.Bookings[slot].bookingYear}</TableRowColumn>
                                                        <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{startTimeHours}:{startTimeMinutes}</TableRowColumn>
                                                        <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{endTimeHours}:{endTimeMinutes}</TableRowColumn>
                                                        
                                                        <TableRowColumn>
                                                        <RaisedButton secondary={true}  label="Cancel" onClick={()=>this.cancelBooking(index,parking.pushKey,slotRef.Bookings[slot].bookingPushKey)} />
                                                        </TableRowColumn>
                                                    </TableRow>
                                                    )
                                                }
                                            }):""
                                          )
                                }):""
                                    )
                            }):<p style={{color:"red",marginLeft:"45%"}}>No Bookings</p>
                            }
                    </TableBody>
           </Table>
          </div>
          <div style={styles.slide}>
                      <Table >
                          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow style={{textAlign:"center"}}>
                              <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>S.No</TableHeaderColumn>
                              <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Name</TableHeaderColumn>
                              <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Email</TableHeaderColumn>
                              <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Delete User</TableHeaderColumn>
                            </TableRow>
                          </TableHeader>
                          <TableBody stripedRows={true} displayRowCheckbox={false}>
                  {this.props.users.map((user,index)=>{
                    if(user.value === "User"){
                      return(
                            <TableRow key={index} >
                              <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{index} </TableRowColumn>
                              <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{user.fullName}</TableRowColumn>
                              <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{user.email}</TableRowColumn>
                              <TableRowColumn>
                                <RaisedButton secondary={true}  onClick={()=>this.deleteUser(user.id)}label="Delete" />
                              </TableRowColumn>
                            </TableRow>
                      )
                    }
                  })}
                  </TableBody>
                </Table>
                </div>
                <div style={styles.slide}>
                <List>
                    {(this.props.usersFeedbacks)?this.props.usersFeedbacks.map((feedback,index)=>{
                      console.log(feedback)
                                  return(
                                    <Paper style={{backgroundColor:"lightBlack"}}>
                                    <ListItem className="feed" key={index} style={{alignContent:"center"}}
                                     leftAvatar={<Avatar 
                                      color={deepOrange300}
                                      backgroundColor={purple500}
                                      size={40}>{feedback.userName.slice(0, 1)}</Avatar>}
                                    primaryText={feedback.feedback} 
                                          nestedItems={[
                                            <ListItem style={{marginLeft:"30px",color:"blue"}}
                                            primaryText={`User Name: ${feedback.userName}`}
                                                />,
                                            ]}
                                          />
                                          </Paper>
                                  )
                                }):<p style={{marginLeft:20 ,color:"red"}}>No feedback to show!</p>
                                }
                </List>   
                </div>
          <div style={styles.slide}>
          <Paper zDepth={4} style={styles.style} >
          <ValidatorForm onSubmit={(e) => e.preventDefault()}>
          <h1 style={{color:"blue",fontFamily:"Times New Roman"}}>
              New Area
               <Divider />
          </h1>
            <Paper style={styles.styleArea} >
                <TextField
                 hintText="Area" 
                underlineShow={false} fullWidth={false}
                value={this.state.area}
                onChange={ev => this.setState({area:ev.target.value})}
                name="area"
                validators={['required']}
                />
              </Paper>
              <Paper style={styles.stylePlace}>
                <TextField
                  value={this.state.place}
                  hintText="Place"
                  name="place"
                  type="string"
                  validators={['required']}
                  
                  underlineShow={false} fullWidth={false}
                  onChange={ev => this.setState({place:ev.target.value})}
                />
              </Paper>
              <Paper style={styles.styleSlots}>
                <TextField
                  value={this.state.slots}
                  hintText="Slots"
                  name="Slots"
                  type="number"
                  validators={['required']}
                  underlineShow={false} fullWidth={false}
                  onChange={ev => this.setState({slots:(ev.target.value)})}
                />
              </Paper>
              <p style={{color:"red"}}>{this.state.error}</p>
              <RaisedButton label="ADD Area" primary={true}
                 style={styles.styleButton} type="submit" onClick={this.addArea}/>
          </ValidatorForm>
          </Paper>
          </div>
        </SwipeableViews>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        users: state.dataReducer.userData,
        parkingArea:state.dataReducer.parkingArea,
        usersFeedbacks:state.dataReducer.usersFeedback
    }   
  }
  const mapDispatchToProp = (dispatch) =>({
    getUsersData: (test) => dispatch(getUsersData(test)),
    getAreaData: (test) => dispatch(getAreaData(test)),
    startDeleteUser: (data) => dispatch(startDeleteUser(data)),
    startAddArea: (data) => dispatch(startAddArea(data)),
    startCancelBooking: (data) => dispatch(startCancelBooking(data)),
    getUsersFeedbackData: (test) => dispatch(getUsersFeedbackData(test))
  })
export default connect(mapStateToProps,mapDispatchToProp)(Admin)