import { useParams } from "react-router-dom";

const RedirectForm = () => {
  const { shortURL } = useParams();

  fetch("http://localhost:8080/redirect/" + shortURL).then((r) => {
    r.json().then((data) => {
      const longURL = data.longURL;
      window.location.href = longURL;
    });
  });
};

export default RedirectForm;
