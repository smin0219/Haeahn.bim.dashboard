import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './page/Login'
import Overview from './page/Overview'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/overview" element={<Overview />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
