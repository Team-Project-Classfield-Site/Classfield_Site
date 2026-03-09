import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import ClassfieldPage from "./pages/ClassfieldPage";
import FavoritesPage from "./pages/Favoritespage";
import LayoutSite from './components/LayoutSite';
import MyAdsPage from "./pages/MyAdsPage";
import AddAdPage from "./pages/AddAdPage";
import EditAdPage from "./pages/EditAdPage";
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutSite />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="classfield_page/:id" element={<ClassfieldPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="my-ads" element={<MyAdsPage />} />
            <Route path="add-ad" element={<AddAdPage />} /> 
            <Route path="edit-ad/:id" element={<EditAdPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;