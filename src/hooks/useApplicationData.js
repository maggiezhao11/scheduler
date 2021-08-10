import {useState, useEffect, useReducer} from "react";
import axios from "axios";
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

const updatedSpots = (state, currentDayObj) =>{
  const currentDayObjIndex = state.days.findIndex(dayObj => dayObj.name === currentDayObj.name)
  const listOfAppointmentIds = currentDayObj.appointments
  const listOfFreeAppointments = 
    listOfAppointmentIds.filter(appointmentId => {
    const appointment = state.appointments[appointmentId]
    if(!appointment.interview){
      return true
    } return false
  })
  const newSpots = listOfFreeAppointments.length
  const updatedState = {...state}
    updatedState.days = [...state.days]
  const updatedDay = {...currentDayObj} 
    updatedDay.spots = newSpots
    updatedState.days[currentDayObjIndex] = updatedDay
  return updatedState;
}


export default function useApplicationData(initial) {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";


  function reducer(state, action) {
    const { day, days, interview, appointments, interviewers, id} = action; 
    switch (action.type) {
      case SET_DAY:
        return { ...state, day}
      case SET_APPLICATION_DATA:
        return { ...state, days, appointments, interviewers}
      case SET_INTERVIEW: {
        const day = state.days.find(day => {
          return day.appointments.find(appointmentId => { 
           return appointmentId === id
          })
         })
        
          const appointment = {
            ...state.appointments[id],
            interview: interview 
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
         
        return updatedSpots({...state, appointments}, day);
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const initialState = {day:"Monday", days:[], appointments:{}};
  const [state, dispatch] = useReducer(reducer, initialState);
  const setDay = day => dispatch({type: "SET_DAY", day});
  const setInterview = (id, interview) => dispatch({type: "SET_INTERVIEW", id, interview})
  const setApplicationData = (days, appointments, interviewers) => dispatch({type:"SET_APPLICATION_DATA", days, appointments, interviewers })

  // dispatch({type: "SET_INTERVIEW", value:state});


  
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });
  
  // const setDay = day => dispatch({type: "SET_DAY", day});

  function bookInterview(id, interview) {
    const day = state.days.find(day => {
      return day.appointments.find(appointmentId => { 
       return appointmentId === id
      })
     })
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, {interview}) 
      .then(() => {
        console.log("before setState line 76", state )
        setInterview(id, interview)
        // setTimeout(() => console.log("after setState line 78", state))
      });
  }

  function cancelInterview(id) {
    const day = state.days.find(day => {
     return day.appointments.find(appointmentId => { 
      return appointmentId === id
     })
    })
    return axios.delete(`/api/appointments/${id}`) 
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setInterview(id, null)
      })
    }
  


    useEffect(() => {
      const webSocket = new WebSocket(WEBSOCKET_URL, "protocolOne");
      //send data after the connection is established by onopen event handler
      // webSocket.onopen = function (event) {
      //   //we can use JSON.stringify() to convert an object to a string
      //   // webSocket.send(JSON.stringify(msg));
      //   webSocket.send("ping");
      // };
      webSocket.onmessage = function (event) {
        
        // parse the event data(message) from server to convert string back to obj
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
        // dispatch({type:parsedData.type...})==>show the data structure
        dispatch({...parsedData});
      }
      
      // webSocket.onopen = function (event) {
      //   webSocket.send("ping");
      // };
      Promise.all([
        axios.get('/api/days'), //GET DAYS
        axios.get('/api/appointments'), //GET APPOINTMENTS
        axios.get('/api/interviewers') //GET INTERVIEWERS
      ]).then((all) => {
        setApplicationData(all[0].data, all[1].data, all[2].data);
      })
    }, [])




  return {state, setDay, bookInterview, cancelInterview};
}