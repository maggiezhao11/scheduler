import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import axios from "axios";

import Application from "components/Application";

afterEach(cleanup);


describe("Appointment", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments))==>the way to use prettyDOM func
    const appointment = appointments[0];
    // debug(appointment); ==> the way to use debug func
    // 3. Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) => queryByText(appointment, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "ARE YOU SURE YOU WANT TO DELETE?")).toBeInTheDocument();
    // debug(appointment);
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) => queryByText(appointment, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 4. change interviewer name
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    // 5. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // 7. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Archie Cohen"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  
  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments))
    const appointment = appointments[0];
    // debug(appointment);
    // 3. Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that the element with the text "error saving" is displayed.
    await waitForElement(() => getByText(appointment, "Could not save the appointment."));
    fireEvent.click(getByAltText(appointment, "Close"));

  });

  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) => queryByText(appointment, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "ARE YOU SURE YOU WANT TO DELETE?")).toBeInTheDocument();
    // debug(appointment);
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "error deleting" is displayed.
    await waitForElement(() => getByText(appointment, "Could not cancel the appointment."));
    fireEvent.click(getByAltText(appointment, "Close"));

  });
  

});










