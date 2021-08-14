import React from "react";
import classnames from "classnames";
import "components/InterviewerListItem.scss";


// id:number - the id of the interviewer
// name:string - the name of the interviewer
// avatar:url - a url to an image of the interviewer
// selected:boolean - to determine if an interview is selected or not
// setInterviewer:function - sets the interviewer upon selection



export default function InterviewerListItem(props) {
  const { name, avatar, selected } = props;
  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected":selected
  });
  return (
    //only call the function inline when we call it. 
    <li className={interviewerClass} onClick={()=>props.setInterviewer(props.id)}> 
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  );
}
