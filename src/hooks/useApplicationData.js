import {useEffect, useReducer} from "react";
import axios from "axios";
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

const updatedSpots = (state, day) =>{
  const currentDay = day || state.day
  const currentDayObj = state.days.find(dayObj => dayObj.name === currentDay)
  const currentDayObjIndex = state.days.findIndex(dayObj => dayObj.name === currentDay)
  const listOfAppointmentIds = currentDayObj.appointments
  const listOfFreeAppointments = listOfAppointmentIds.filter(appointmentId => !state.appointments[appointmentId].interview)
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
    const { type, day, days, interview, appointments, interviewers, id} = action; 
    //switch(action.type)
    switch (type) {
      case SET_DAY:
        return { ...state, day}
      case SET_APPLICATION_DATA:
        return { ...state, days, appointments, interviewers}
      case SET_INTERVIEW: {
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
          `Tried to reduce with unsupported action type: ${type}`
        );
    }
  }
  const initialState = {day:"Monday", days:[], appointments:{}};
  const [state, dispatch] = useReducer(reducer, initialState);
  const setDay = day => dispatch({type: "SET_DAY", day});
  const setInterview = (id, interview) => dispatch({type: "SET_INTERVIEW", id, interview})
  const setApplicationData = (days, appointments, interviewers) => dispatch({type:"SET_APPLICATION_DATA", days, appointments, interviewers })

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {interview}) 
      .then(() => {
        setInterview(id, interview)
        // setTimeout(() => console.log("after setState line 78", state))
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`) 
      .then(() => {
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