import React from "react";
import "components/Appointment/styles.scss";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Header from "components/Appointment/Header";
import { useVisualMode } from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";


export default function Appointment(props) {
  console.log("props:", props);
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE= "CREATE";
  const SAVING= "SAVING";
  const EDIT= "EDIT";
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
    props.bookInterview(props.id, interview);
    transition(SHOW);

  }

  return (
    <article className="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show  onEdit={() => transition(EDIT)}
            student={props.interview && props.interview.student}
            interviewer={props.interview && props.interview.interviewer}
          />         
        )}
        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />
        )}
        {mode === SAVING && <Status />}
        {mode === EDIT && (
          <Form 
            student={props.interview.student}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />
        )}       

    </article>
  );
}