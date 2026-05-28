import "./index.css";
import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./presentations/pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<IndexPage />} />
      </Route>
    </Routes>
  );
}

export default App;
