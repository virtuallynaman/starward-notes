import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import Footer from "./Footer";
import NotesProvider from "./NotesProvider";
import NoteDetails from "./NoteDetails";

function App() {

  return (
    <NotesProvider>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/note/:id" element={<NoteDetails />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </NotesProvider >
  );
}

export default App;