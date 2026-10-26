import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className='hero'>
      <p className='eyebrow'>RESTAURANT ADMIN</p>
      <h2>จัดการรายการอาหารของคุณ</h2>
      <p>เพิ่ม แก้ไข ลบ และค้นหาเมนูอาหารผ่าน Restaurant Backend API</p>
      <Link className='primary-link' to='/menu'>จัดการเมนู</Link>
    </section>
  );
}
