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
