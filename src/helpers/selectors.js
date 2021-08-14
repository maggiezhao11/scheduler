//refactor code to avoid nested loop ==> array.map followed by fo loop (wrong way)

export function getAppointmentsForDay(state, selectedDay) {
  //find the targetDay obj from state.days
  const targetDay = state.days.find(day => {
    return day.name === selectedDay ? true : false 
  });
  //check state day info and user input day info 
  if (state.days.length === 0 || targetDay === undefined) {
    return [];
  }
  //map the currentDay appointments to get the appointmentId, then get info from state.appointments by appt.id
  const filteredAppointments = targetDay.appointments.map(id => state.appointments[id])

  return filteredAppointments;
}

export function getInterviewersForDay(state, selectedDay) {
  //shorten hand version to change them as one line of code
  const found = state.days.find(day => selectedDay === day.name);
  if (state.days.length === 0 || found === undefined) return [];
  return found.interviewers.map(id => state.interviewers[id]);
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

  //**better way of refactoring it as following**
  // return (
  //   interview && {
  //     ...interview,
  //     interviewer: state.interviewers[interview.interviewer]
  //   }
  // );
}

