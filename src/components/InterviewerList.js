import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

// interviewers:array - an array of objects containing the information of each interviewer
// interviewer:number - the id of an interviewer
// setInterviewer:function - a function that accepts an interviewer id


export default function InterviewerList(props) {
  const list = props.interviewers.map((interviewer) => { 
    return <InterviewerListItem 
      key={interviewer.id}
      id={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.value}
      setInterviewer={ ()=> props.onChange(interviewer.id)}
    /> 
  })
  
    return (
    <ul>
      <section className="interviewers">
        <h4 className="interviewers__header text--light">{props.name}</h4>
        <ul className="interviewers__list">
        {list}
        </ul>
      </section>
    </ul> 
    )

}