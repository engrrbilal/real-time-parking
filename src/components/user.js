import React from 'react';
import * as firebase from 'firebase';
import dataReducer from '../reducers/dataReducer'
import {getUserProfileData,startUpdateUser,getAreaData,submitUserFeedback,startBooking,startCancelBooking} from '../actions/dataActions'
import {connect} from 'react-redux'
import '../App.css';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem,Toggle,Subheader, Dialog,Paper,RaisedButton,Divider,TextField,SelectField} from 'material-ui';
import ActionInfo from 'material-ui/svg-icons/action/info';
import {indigo500} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import ValidatorForm from 'react-form-validator-core/lib/ValidatorForm';
const styles = {
    headline: {
      fontSize: 24,
      paddingTop: 16,
      marginBottom: 12,
      fontWeight: 400,
    },
    slide: {
      padding: 10,
    },
    style:{
        marginLeft: 20,
    }
  };
class User extends React.Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            open2:false,
            userUid:'',
            displayName:'',
            createdAt:'',
            slideIndex: 0,
            disabled:true,
            feedback:'',
            fullName:'Anonymous',
            contactNo:0,
            address:"Not added",
            update:false,
            controlledDate: null,
            startTime:null,
            endTime:null,
            pushKey:"",
            selectedSlotsIndex:'',
            parkingSlots:[],
            booked:"true",
            bookingDate:'',
            parkingArea:'',
            parkingPlace:'',
            bgColor:["green","green","green","green","green","green","green","green","green","green",
                    "green","green","green","green","green","green","green","green","green","green",
                    "green","green","green","green","green","green","green","green","green","green",
                    "green","green","green","green","green","green","green","green","green","green",
                    "green","green","green","green","green","green","green","green","green","green",
                ]
        }
    }
    componentWillMount(){
        {this.props.getUserProfileData({
            user:"From user Dispatch"
          })}
          {this.props.getAreaData({
            user:"From user Dispatch"
          })}
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ 
                    userUid: user.uid,
                    displayName:user.displayName
                 });
            } else {
                this.setState({ userUid:''});
            }
        });
        setTimeout(()=>{ 
            if(this.props.user.fullName){
                this.setState({
                    fullName: this.props.user.fullName,
                  })
            }
            },500)
            
    }
    componentDidMount(){
        localStorage.setItem("type", JSON.stringify("/user"))
    }
    componentWillReceiveProps(props){
        if(props.user.fullName){
            this.setState({
                fullName: props.user.fullName,
                displayName:props.user.fullName,
            })
        }
    }
    handleChange = (value) => {
        this.setState({
          slideIndex: value,
        });
      };
      
      submitFeedback = () =>{
          if(this.state.feedback){
            this.props.submitUserFeedback({
                feedback:this.state.feedback,
                userUid:this.state.userUid,
                userName:this.state.displayName
            })
            this.setState({
                feedback:''
            })
          }
      }
    
      handleClose = () => {
        this.setState({
            open:false,
            selectedSlotsIndex:[],
            controlledDate:'',
            startTime:null,
            endTime:null,
        })

      };
      handleCancelSlots = () => {
          for(let i=0;i<50;i++){
            this.state.bgColor.splice(i,1,"green")
          }
          if(this.state.selectedSlotsIndex)
          {
            this.setState({
                selectedSlotsIndex:''
            })
          }
        this.setState({
            open2: false
        })
      };
      handleCloseSlots = () => {
      this.setState({
          open2: false
      })
    };
      handleDateChange = (event, date) => {
        this.setState({
          controlledDate: date,
        });
      };
      handleChangeTimePicker1 = (event, date) => {
        this.setState({startTime: date});
      };
      handleChangeTimePicker2 = (event, date) => {
        this.setState({endTime: date});
      };
      showBooking = (pushKey,parkingSlots,parkingArea,parkingPlace) =>{
        this.setState({
            open: true,
            pushKey:pushKey,
            parkingSlots:parkingSlots,
            parkingArea:parkingArea,
            parkingPlace:parkingPlace
        });
        for(let i=0;i<this.state.parkingSlots;i++)
        {
            this.state.bgColor.splice(i,1,"green")
        }
      }
      
      selectSlots = () => {
        let todayDate = this.state.controlledDate
        let currentDay = todayDate.getDate()
        let currentMonth = todayDate.getMonth()
        let currentYear = todayDate.getFullYear()
        let bookingStartTime = this.state.startTime;
        let startTime=bookingStartTime.getTime()
        let bookingEndTime = this.state.endTime;
        let endTime=bookingEndTime.getTime();
        let currentTime = Date.now();
            this.state.parkingSlots.map((slotRef,index)=>{
                slotRef.Bookings?Object.keys(slotRef.Bookings).map((slot)=>{
                    if(currentDay===slotRef.Bookings[slot].bookingDay && currentMonth===slotRef.Bookings[slot].bookingMonth
                         && currentYear===slotRef.Bookings[slot].bookingYear){
                            if(slotRef.Bookings[slot].booked==="true"){
                                if(startTime > slotRef.Bookings[slot].endTime){
                                    console.log("green")
                                    this.state.bgColor.splice(index+1,1,"green")
                                 }
                                 else if(currentTime>endTime || currentTime>startTime){
                                    for(let i=0;i<50;i++){
                                        this.state.bgColor.splice(i,1,"green")
                                      }
                                 }
                                 else{
                                    this.state.bgColor.splice(index,1,"red")
                                 }
                            }
                    }
                    else{
                        if(slotRef.Bookings[slot].booked==="true"){
                            this.state.bgColor.splice(index+1,1,"green")
                            console.log(index+1)
                    }   
                  }
                }):""
            })
        this.setState({open2: true});
      };
      bookSlots = (slotIndex)=>{
          this.state.parkingSlots.map((slot,index)=>{
              if(slotIndex===index){
                this.state.bgColor.splice(index,1,"red")
                    this.setState({
                        selectedSlotsIndex:slotIndex
                    })
            }
            
          })
      }
      sendBookedSlots=()=>{
          if(this.state.selectedSlotsIndex.length <=0)
          {
              alert("Please select the Slot for booking!")
          }
          else
          {
            let bookingDate=this.state.controlledDate
            let bookingDay = bookingDate.getDate();
            let bookingMonth = bookingDate.getMonth();
            let bookingYear = bookingDate.getFullYear();
            let bookingStartTime = this.state.startTime;
            let startTime=bookingStartTime.getTime()
            console.log(bookingStartTime)
            console.log(startTime)
            let bookingEndTime = this.state.endTime;
            let endTime=bookingEndTime.getTime();
            let currentTime = Date.now();
            let todayDate = new Date()
            let currentDay = todayDate.getDate()
            let currentMonth = todayDate.getMonth()
            let currentYear = todayDate.getFullYear()
            if(startTime>endTime){
                alert("Please Select the time correctly!")
            }
            else if(currentDay===bookingDay){
                if(currentTime>startTime || currentTime>endTime || startTime>endTime){
                    alert("Please Select the time correctly!")
                    }
                    else{
                        this.props.startBooking({
                            bookingDate:this.state.bookingDate,
                            bookingDay:bookingDay,
                            bookingMonth:bookingMonth,
                            bookingYear:bookingYear,
                            startTime:startTime,
                            endTime:endTime,
                            selectedSlotsIndex:this.state.selectedSlotsIndex,
                            userUid:this.state.userUid,
                            pushKey:this.state.pushKey,
                            parkingArea:this.state.parkingArea,
                            parkingPlace:this.state.parkingPlace
                          })
                          this.setState({
                            open:false,
                            selectedSlotsIndex:[],
                            controlledDate:'',
                            startTime:null,
                            endTime:null,
                        })
                        for(let i=0;i<50;i++){
                            this.state.bgColor.splice(i,1,"green")
                          }
                    }
            }  
          }
      }
      cancelBooking(cancelIndex,pushKey,bookingPushKey){
          console.log(cancelIndex,pushKey,bookingPushKey)
        this.props.startCancelBooking({
          cancelIndex:cancelIndex,
          pushKey:pushKey,
          bookingPushKey:bookingPushKey
        })
      }
      editProfile = ()=>{
          this.setState({
            disabled:false,
            update:true,
          })
   
      }
      updateProfile = ()=>{
           this.applyUpdateDispatch()
    }
    applyUpdateDispatch(){
        if(this.state.fullName ==="")
        {
            alert("Please fill the name field!")
        }
        else{
            this.props.startUpdateUser({
                id:this.state.userUid,
                fullName:this.state.fullName,
                displayName:this.state.fullName,
                contactNo:this.state.contactNo,
                address:this.state.address
            })
        }
      }
      renderButton(){
        if (this.state.controlledDate && this.state.startTime && this.state.endTime) {
            return (
                <RaisedButton secondary={true}  label="Select Slots" onClick={this.selectSlots}
                />
            )
        }
        return (
            <RaisedButton secondary={true}  label="Select Slots" onClick={this.selectSlots}
            disabled={true} disabledBackgroundColor={"red"}
            />
        );
    }
    render(){
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Book"
              primary={true}
              onClick={this.sendBookedSlots}
            />,
          ];
          const actions2 = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleCancelSlots}
            />,
            <FlatButton
              label="ok"
              primary={true}
              onClick={this.handleCloseSlots}
            />,
          ];
          let todayDate = new Date();
        return (
            <div className="userBackground" style={{width:"100%",minHeight:900,maxHeight:"100%"}}>
            <div style={{height:"40px",color:"black",backgroundColor:"lightBlue",marginTop:"-24px"}}>
                <center>
                  <p style={{fontSize:"24px"}}>{`Welcome ${this.state.displayName} to the Real Time Parking`}</p>
                </center>
            </div>
            <div>
                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                >
                    <Tab label="Book Parking" value={0}/>
                    <Tab label="View Bookings" value={1}/>
                    <Tab label="Feedback" value={2}/>
                    <Tab label="Profile" value={3}/>
                </Tabs>
                <SwipeableViews
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                >
                    <div>
                        <Table style={{opacity:"0.7",fontSize:"24"}}>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow style={{textAlign:"center"}}>
                                    <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>S.No</TableHeaderColumn>
                                    <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Parking Area</TableHeaderColumn>
                                    <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Parking Place</TableHeaderColumn>
                                    <TableHeaderColumn style={{fontSize:"36",fontWeight:"bold",color:"blue"}}>Book Parking</TableHeaderColumn>
                                </TableRow>
                                </TableHeader>
                                <TableBody stripedRows={true} displayRowCheckbox={false}>
                                {this.props.parkingArea?
                                  this.props.parkingArea.map((parking,index)=>{
                                    return(
                                        <TableRow key={index} >
                                            <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{index +1} </TableRowColumn>
                                            <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{parking.area}</TableRowColumn>
                                            <TableRowColumn style={{fontSize:"24",fontWeight:"bold"}}>{parking.place}</TableRowColumn>
                                            <TableRowColumn>
                                            <RaisedButton secondary={true}  label="Book" onClick={()=>this.showBooking(parking.pushKey,parking.Slots,parking.area,parking.place)} />
                                            </TableRowColumn>
                                        </TableRow>
                                    )
                                }):<CircularProgress size={80} thickness={5} style={{marginLeft:"50%",marginTop:"20%"}}/>}
                                </TableBody>
                        </Table>
                        <Dialog
                        title="Book Parking"
                        actions={actions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                        autoScrollBodyContent={true}
                        >
                            <div>
                                <DatePicker
                                    hintText="Pick Parking Date"
                                    value={this.state.controlledDate}
                                    onChange={this.handleDateChange}
                                    minDate={todayDate}
                                />
                            </div>
                            <div>
                            <TimePicker
                                format="ampm"
                                hintText="Pick Start Time"
                                value={this.state.startTime}
                                onChange={this.handleChangeTimePicker1}
                                />

                                <TimePicker
                                format="ampm"
                                hintText="Pick End Time"
                                value={this.state.endTime}
                                onChange={this.handleChangeTimePicker2}
                                />
                            </div>
                                {this.renderButton()}
                                </Dialog>
                                <div>
                                <Dialog
                                    title="Select Slots"
                                    actions={actions2}
                                    modal={false}
                                    open={this.state.open2}
                                    onRequestClose={this.handleCloseSlots}
                                    >
                                    {this.state.parkingSlots.map((val,index)=>{
                                         if(this.state.bgColor[index] ==="red"){
                                            //  console.log(this.state.parkingSlots[index].booked)
                                          return  <RaisedButton label={`Slot${index + 1}`} disabled={true}
                                           disabledBackgroundColor="red" style={{margin:"5px"}}/>
                                         }else{
                                            // console.log(this.state.parkingSlots[index].booked)
                                            return <RaisedButton label={`Slot${index + 1}`} style={{margin:"5px"}}
                                                 key={index} backgroundColor={this.state.bgColor[index]}
                                                onClick={()=>this.bookSlots(index)}/>
                                            }
                                    })}
                                </Dialog>
                                </div>
                    </div>
                 <div>
                 <Table style={{opacity:"0.7"}}>
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
                    </TableHeader>
                    <TableBody stripedRows={true} displayRowCheckbox={false}>
                                { (this.props.parkingArea)?
                                  this.props.parkingArea.map((parking)=>{
                                    return(
                                      parking.Slots.map((slotRef,index)=>{
                                          return(
                                            slotRef.Bookings?Object.keys(slotRef.Bookings).map((slot)=>{
                                                if(slotRef.Bookings[slot].userUid === this.state.userUid){
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
                                })
                                    )
                            }):<p style={{color:"red",marginLeft:"45%"}}>No Bookings</p>
                            }
                    </TableBody>
           </Table>
                </div>
                <div style={{opacity:"0.7"}}>
                    <Paper zDepth={4} style={{marginLeft:"30%",width:"40%",maxHeight:"200px"}} >
                        <ValidatorForm onSubmit={(e) => e.preventDefault()}>
                        <h1 style={{color:"blue",fontFamily:"Times New Roman",textAlign:"center"}}>
                            Feedback
                            <Divider />
                        </h1>
                            <TextField value={this.state.feedback} hintText="Your feedback ..."
                                onChange={(ev) =>this.setState({feedback:ev.target.value})}
                                rowsMax={3} multiLine={true} fullWidth={true}
                            />
                            <RaisedButton label="Submit" primary={true} style={{marginLeft:"40%"}} onClick={this.submitFeedback}/>
                        </ValidatorForm>
                    </Paper>
                </div>
                    <div >
                    <Card style={{opacity:"0.7"}}>
                        <CardHeader
                        title={<p style={{textAlign:"center"}}>Your profile</p>}
                        style={{align:"center"}}
                        />
                        <div>
                            <TextField floatingLabelText="Full Name" value={this.state.fullName}  style={styles.style} underlineShow={false}
                                disabled={this.state.disabled} onChange={(e)=>this.setState({fullName:e.target.value})}/>
                                <Divider />
                            <TextField floatingLabelText="Contact No" type="number" value={this.state.contactNo} style={styles.style} underlineShow={false}
                                disabled={this.state.disabled} onChange={(e)=>this.setState({contactNo:e.target.value})}/>
                            <Divider/>
                            <TextField floatingLabelText="Address" type="string" value={this.state.address} style={styles.style} underlineShow={false}
                                disabled={this.state.disabled} onChange={(e)=>this.setState({address:e.target.value})}/>
                            <Divider/>
                            {(this.state.update)?
                                <RaisedButton label="Update" primary={true} onClick={this.updateProfile} 
                                    style={{height:"50",fontWeight:"bold"}} labelStyle={{fontSize:'24px'}} fullWidth={true}/>:
                                    <RaisedButton label="Edit" primary={true} onClick={this.editProfile} fullWidth={true}
                                    style={{height:"50",fontSize:'30%'}}
                                    labelStyle={{fontSize:'24px'}}
                                     />
                            }
                        </div>
                    </Card>
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
        user: state.dataReducer.userProfile,
        parkingArea:state.dataReducer.parkingArea,
        bookedSlots:state.dataReducer.bookedSlots
    }   
  }
  const mapDispatchToProp = (dispatch) =>({
    getUserProfileData: (test) => dispatch(getUserProfileData(test)),
    startUpdateUser: (test) => dispatch(startUpdateUser(test)),
    getAreaData: (test) => dispatch(getAreaData(test)),
    startBooking: (data) => dispatch(startBooking(data)),
    startCancelBooking: (data) => dispatch(startCancelBooking(data)),
    submitUserFeedback: (data) => dispatch(submitUserFeedback(data)),
  })
export default connect(mapStateToProps,mapDispatchToProp)(User)