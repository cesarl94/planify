import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { UserProvider } from "./Context/UserContext";
import { CardStatusProvider } from "./Context/CardStatusContext";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }

]);
function App() {
  return (
    <div >
      <CardStatusProvider>
        <UserProvider>
          <RouterProvider router={router}></RouterProvider>
        </UserProvider>
      </CardStatusProvider>
    </div>
  );
}

export default App;
