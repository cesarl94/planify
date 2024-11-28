import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { UserProvider } from "./Context/UserContext";
import { CardStatusProvider } from "./Context/CardStatusContext";
import Login from "./Pages/Login/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./Pages/Register/Register";
import RegisterEnded from "./Pages/RegisterEnded/RegisterEnded";
import { TaskProvider } from "./Context/TaskContext";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import SentEmail from "./Pages/SentEmail/SentEmail";
import RecoverPassword from "./Pages/RecoverPassword/RecoverPassword";
import PasswordRecovered from "./Pages/PasswordRecovered/PasswordRecovered";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Home/>
  },
  {
    path: "/Login",
    element: <Login/>
  },
  {
    path: "/Register",
    element: <Register/>
  },
  {
    path: "/RegisterEnded",
    element: <RegisterEnded/>
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword/>
  },
  {
    path: "/SentEmail",
    element: <SentEmail/>
  },
  {
    path: "/RecoverPassword",
    element: <RecoverPassword/>
  },
  {
    path: "/PasswordRecovered",
    element: <PasswordRecovered/>
  }
]);



function App() {

  return (
    <div >
      <TaskProvider>
      <CardStatusProvider>
        <UserProvider>
          <RouterProvider router={router}></RouterProvider>
        </UserProvider>
      </CardStatusProvider>
      </TaskProvider>
    </div>
  );
}

export default App;
