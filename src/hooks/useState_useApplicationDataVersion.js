import {useState, useEffect} from "react";
import axios from "axios";
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;



export default function useApplicationData(initial) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

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
        setState(updatedSpots({...state, appointments}, day))
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
        setState(updatedSpots({...state, appointments}, day))
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
        console.log("line 91:", parsedData);
      }
      
      webSocket.onopen = function (event) {
        webSocket.send("ping");
      };
      Promise.all([
        axios.get('/api/days'), //GET DAYS
        axios.get('/api/appointments'), //GET APPOINTMENTS
        axios.get('/api/interviewers') //GET INTERVIEWERS
      ]).then((all) => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      })
    }, [])




  return {state, setDay, bookInterview, cancelInterview};
}