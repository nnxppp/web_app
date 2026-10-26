import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../services/api.js';
export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' }); const [error, setError] = useState(''); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); setError(''); try { const { data } = await authApi.login(form); localStorage.setItem('token', data.token); navigate('/'); } catch (err) { setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'); } };
  return <main className='auth-page'><form className='auth-card' onSubmit={submit}><p className='eyebrow'>TODO APP</p><h1>เข้าสู่ระบบ</h1><p className='muted'>จัดการรายการงานของคุณอย่างเป็นส่วนตัว</p>{error && <p className='message error'>{error}</p>}<label>ชื่อผู้ใช้<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label>รหัสผ่าน<input required type='password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button type='submit'>เข้าสู่ระบบ</button><p className='switch'>ยังไม่มีบัญชี? <Link to='/register'>สมัครสมาชิก</Link></p></form></main>;
}
