import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { NotesProvider } from "./NotesProvider";
import SignUp from "./SignUp";
import Login from "./Login";
import HomePage from "./HomePage";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <NotesProvider><HomePage /></NotesProvider> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          exact
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;