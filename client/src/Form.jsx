import { useState } from "react";

const Form = () => {
  const [duplicateError, setDuplicateError] = useState("");
  const [successNote, setSuccessNote] = useState("");

  const shortenURL = async (e) => {
    setDuplicateError("");
    setSuccessNote("");
    e.preventDefault();

    // getting the form details
    const longURL = $($("#longURL").get(0));
    const shortCode = $($("#shortCode").get(0));

    // sending the request to the server
    const response = await fetch("http://localhost:8080/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longURL: $(longURL).val(),
        shortCode: $(shortCode).val(),
      }),
    });

    // check if response is 'ok' & set relavent values on the design
    if (response.ok) {
      setDuplicateError("");
      setSuccessNote("Successfully shortened the URL");
      $(longURL).val("");
      $(shortCode).val("");
    } else {
      setDuplicateError("shortCode already taken, please use another");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        shortenURL(e);
      }}
    >
      <label htmlFor="longURL">Long URL: </label>
      <input type="url" name="longURL" id="longURL" required />
      <br />
      <label htmlFor="shortCode">Shorten Code: </label>
      <input type="text" name="shortCode" id="shortCode" />
      <br />
      <span id="success-note">{successNote}</span>
      <span id="duplicate-error">{duplicateError}</span>
      <br />
      <input type="submit" value="Shorten" />
    </form>
  );
};

export default Form;
