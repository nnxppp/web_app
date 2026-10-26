import { Link, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import MenuPage from '../pages/menus/MenuPage.jsx';

function NotFound() {
  return <section><h2>404</h2><p>ไม่พบหน้าที่คุณต้องการ</p><Link to='/'>กลับสู่หน้าหลัก</Link></section>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/menu' element={<MenuPage />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
