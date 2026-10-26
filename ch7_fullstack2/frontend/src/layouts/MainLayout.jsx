import { NavLink, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className='app-shell'>
      <aside className='sidebar'>
        <p className='brand'>RESTAURANT</p>
        <h1>Menu Manager</h1>
        <nav>
          <NavLink to='/' end>Home</NavLink>
          <NavLink to='/menu'>Menu</NavLink>
        </nav>
      </aside>
      <main className='content'>
        <Outlet />
      </main>
    </div>
  );
}
