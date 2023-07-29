import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home/Home';
import { Toaster } from 'react-hot-toast';




function App() {



  return (
    <div className="App">
      <Home />
      <Toaster></Toaster>
    </div>
  );
}

export default App;
