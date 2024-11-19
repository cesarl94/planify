import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { UserProvider } from "./Context/UserContext";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }
 
]);
function App() {
  return (
    <div >
      <UserProvider>
          <RouterProvider router={router}></RouterProvider>
      </UserProvider>
    </div>
  );
}

export default App;
