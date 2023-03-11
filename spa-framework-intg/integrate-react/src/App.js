import "./App.css";
import { Navbar, Button, Alignment } from "@blueprintjs/core";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Blueprint</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home">
            <Link to="/">Home</Link>
          </Button>
          <Button className="bp3-minimal" icon="document">
            <Link to="/files">Files</Link>
          </Button>
        </Navbar.Group>
      </Navbar>

      <Routes>
        <Route path="/" exact element={<Index />} />
        <Route path="/files" element={<Files />} />
      </Routes>
    </Router>
  );
}

function Index() {
  return <h2>Home</h2>;
}

function Files() {
  return <h2>File</h2>;
}

export default App;
