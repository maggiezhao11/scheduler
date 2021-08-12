
//function for updating remaining spots
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

//useReducer version of useApplicationData
export default function reducer(state, action) {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
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