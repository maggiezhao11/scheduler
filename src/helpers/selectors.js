
export function getAppointmentsForDay(state, selected_day) {
  if (state.days.length <= 0) {
    return [];
  }
  const filteredAppointments = state.days.filter(day => {
    if (day.name === selected_day) return true;
  });
  const getAppointments = [];
  if (filteredAppointments.length === 0) {
    return [];
  }
  Object.keys(state.appointments).map(appointment => {
    for ( let item of filteredAppointments[0].appointments)  {
      if (item === state.appointments[appointment].id) {
        getAppointments.push(state.appointments[appointment]);
      }
    }
  });
  return getAppointments;
}

export function getInterviewersForDay(state, selected_day) {
  if (state.days.length <= 0) {
    return [];
  }
  const filteredInterviewers = state.days.filter(day => {
    if (day.name === selected_day) return true;
  });
  const getInterviewers = [];
  if (filteredInterviewers.length === 0) {
    return [];
  }
  Object.keys(state.interviewers).map(interviewer => {
    for ( let item of filteredInterviewers[0].interviewers)  {
      if (item === state.interviewers[interviewer].id) {
        getInterviewers.push(state.interviewers[interviewer]);
      }
    }
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

//interview: { student: 'Archie Cohen', interviewer: 2 } } ]

//original one 
// {
//   "id":1,
//   "time":"12pm",
//   "interview": {
//     "student": "Lydia Miller-Jones",
//     "interviewer": {
//       "id": 1,
//       "name": "Sylvia Palmer",
//       "avatar": "https://i.imgur.com/LpaY82x.png"
//     }
//   }
// }

// // transforming one
// {  
//   "student": "Lydia Miller-Jones",
//   "interviewer": {  
//     "id": 1,
//     "name": "Sylvia Palmer",
//     "avatar": "https://i.imgur.com/LpaY82x.png"
//   }
// }