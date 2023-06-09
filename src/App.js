import { Route, Routes } from "react-router-dom";

import Loggin from "./Loggin";
import "./App.css";
import SignUp from "./SignUp";

import BookViewAdmin from "./BookViewAdmin";
import HomeViewUser from "./HomeViewUser";
import BookViewUser from "./BookViewUser";
import HomeView from "./HomeView";
import { useContext } from "react";
import AuthContext from "./context/AuthProvider";
import BookingUser from "./BookingUser";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Loggin />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/HomeView" element={<HomeView />} />
        <Route path="/BookViewAdmin/:bookid" element={<BookViewAdmin />} />
        <Route path="/HomeViewUser" element={<HomeViewUser />} />
        <Route path="/BookViewUser/:bookid" element={<BookViewUser />} />
        <Route path="/BookingUSer" element={<BookingUser />} />
      </Routes>
    </div>
  );
}

export default App;
