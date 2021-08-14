//refactor to replace array.filter by array.find


export function getAppointmentsForDay(state, selected_day) {
  if (state.days.length <= 0) {
    return [];
  }
  //change array method from filter to find for better practice, no need to use index [0] later.
  const targetDay = state.days.find(day => {
    return day.name === selected_day ? true : false
  });

  // if (filteredAppointments.length === 0) { ==> filter version
  if (targetDay === null) {
    return [];
  }
  const filteredAppointments = Object.keys(state.appointments).filter(appointment =>  { 

    targetDay.appointments.find(item => item === state.appointments[appointment].id )

    // for ( let item of filteredAppointments.appointments)  {
    //   if (item === state.appointments[appointment].id) {
    //     return true ;
    //   }
    // } 
  });
  return filteredAppointments;
}

export function getInterviewersForDay(state, selected_day) {
  if (state.days.length <= 0) {
    return [];
  } 
  const targetDay = state.days.find(day => {
    return day.name === selected_day ? true : false
  });
  const getInterviewers = [];
  
  if (targetDay === null) {
    return [];
  }
  Object.keys(state.interviewers).map(interviewer => {
    for ( let item of targetDay.interviewers)  {
      if (item === state.interviewers[interviewer].id) {
        getInterviewers.push(state.interviewers[interviewer]);
      }
    } return true
  });
  return getInterviewers;
}



export function getInterview(state, interview) {
  if (!interview) {
    return null
  }
  const interviews = {};
  const interviewerKey = interview.interviewer;
  interviews.interviewer = state.interviewers[interviewerKey];
  interviews.student = interview.student;

  return interviews;
}

