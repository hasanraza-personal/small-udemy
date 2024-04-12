import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Header from "./components/header/Header";
import { Box } from '@chakra-ui/react';
import AdminHome from "./pages/admin_home/AdminHome";
import StudentHome from "./pages/student_home/StudentHome";

const App = () => {
  return (
    <>
      <Header />
      <Box mt={5} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/studenthome" element={<StudentHome />} />
      </Routes>
    </>
  );
};

export default App;
