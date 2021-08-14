import React, {useState} from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";


export default function Form(props) {
  const {interviewers, onCancel, onSave} = props;
  const [name, setName] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  const reset = () => {
    setName("");  
    setInterviewer(null);
  }
  const cancel = () => {
    reset();
    onCancel();
  }
  //validate user input, student name cannot be empty.
  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    } 
    //add validation for interviewer input, interviewer cannot be blank
    if (interviewer === null) {
      setError("You haven't chosen any interviewers yet!");
      return;
    } 
    setError("");
    onSave(name, interviewer);
  }

   const handleTyping = (event) => {
    setError(""); 
    setName(event.target.value)
   }

   const handleInterviewers = (event) => {
    setError(""); 
    setInterviewer(event);
   }


  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()} >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={handleTyping}
            data-testid="student-name-input"  //add testid for test target
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList 
          interviewers={interviewers} 
          value={interviewer} 
          onChange={handleInterviewers}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => validate()}>Save</Button>
        </section>
      </section>
    </main>
  );
}