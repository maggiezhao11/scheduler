import React from "react";
import "components/Appointment/styles.scss";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import Header from "components/Appointment/Header";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE= "CREATE";
const SAVING= "SAVING";
const EDIT= "EDIT";
const CONFIRM= "CONFIRM";
const DELETING= "DELETING";
const ERROR_SAVE= "ERROR_SAVE";
const ERROR_DELETE= "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    // console.log("name:", name);
    // console.log("interviewer:", interviewer)
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
    .bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }

  function cancel(event) {
    transition(DELETING, true);
    props
    .cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => {
      transition(ERROR_DELETE, true)});

  }

  return (
    <article className="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && props.interview && (
          <Show  onEdit={() => transition(EDIT)}
            student={props.interview && props.interview.student}
            interviewer={props.interview && props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
          />         
        )}
        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />
        )}
        {mode === SAVING && <Status message="SAVING"/>}
        {mode === EDIT && (
          <Form 
            student={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />
        )}
        {mode === DELETING && <Status message="DELETING"/>}    
        {mode === CONFIRM && <Confirm message="ARE YOU SURE YOU WANT TO DELETE?" 
          onCancel={back}
          onConfirm={cancel}
        />}
        {mode === ERROR_DELETE && <Error message="Could not cancel the appointment" 
          onClose={() => transition(SHOW)}
        />}
        {mode === ERROR_SAVE && <Error message="Could not save the appointment"/>}  

    </article>
  );
}