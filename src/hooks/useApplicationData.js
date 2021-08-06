import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData(initial) {

  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState('Monday');
  // const [appointments, setAppointments] = useState({})
  //combined all states into one state object, then use the action setState to update it going forward
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    console.log(id, interview);
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
        setState({...state, appointments})
      });
  }

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`) 
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: "null"
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState({...state, appointments})
      });
  }

  // const appointments = getAppointmentsForDay(state, state.day);
  // const interviewers = getInterviewersForDay(state, state.day);
  // console.log("interviewers:", interviewers);
  // const schedule = appointments.map((appointment) => {
  //   const interview = getInterview(state, appointment.interview);
  //   return (
  //     <Appointment 
  //     // key={appointment.id} {...appointment}  /// ****** here needs review codes
  //     key={appointment.id}
  //     id={appointment.id}
  //     time={appointment.time}
  //     interview={interview}
  //     interviewers={interviewers}
  //     bookInterview={bookInterview}
  //     cancelInterview={CancelInterview}  
  //     /> )
  //   });

    useEffect(() => {
      // axios.get('/api/days').then(response => {
      //   // console.log("response.data:", response.data);
      //   setDays([...response.data])
      // });
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