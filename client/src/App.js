import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Chat from './pages/Chat/Chat'
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import { Provider } from 'react-redux';
import store from './store/store';
import Avatar from './pages/Avatar/Avatar';


function App() {
  // const [isAuthenticated, isUserAuthenticated] = useState(false);
  return (
    <BrowserRouter>
      <Provider store={store}>
      <div className="app">
      <ToastContainer />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/' element={<Chat />} />
            <Route path='/avatar' element={<Avatar />}/>
          </Route>
        </Routes>
      </div>
      </Provider>
    </BrowserRouter>
  )
}

export default App;
