import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Form from "./Form";
import RedirectPage from "./RedirectPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:shortURL" element={<RedirectPage />} />
        <Route path="/app" element={<Form />} />
        <Route path="/" element={<Form />} />
      </Routes>
    </Router>
  );
};

export default App;
