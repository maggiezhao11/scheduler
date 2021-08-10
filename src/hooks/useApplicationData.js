import {useEffect, useReducer} from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;



export default function useApplicationData(initial) {
 
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