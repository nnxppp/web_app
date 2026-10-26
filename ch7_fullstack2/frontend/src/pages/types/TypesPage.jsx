import { useEffect, useState } from 'react';
import { typeApi } from '../../services/restaurantApi.js';

export default function TypesPage() {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadTypes = async () => {
    try { setTypes(await typeApi.getAll()); } catch (err) { setError(err.response?.data?.message || 'โหลดประเภทเมนูไม่สำเร็จ'); }
  };
  useEffect(() => { loadTypes(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) { setError('กรุณาระบุชื่อประเภทเมนู'); return; }
    setError('');
    try {
      if (editingId) { await typeApi.update(editingId, { name }); setMessage('อัปเดตประเภทเมนูเรียบร้อยแล้ว'); }
      else { await typeApi.create({ name }); setMessage('เพิ่มประเภทเมนูเรียบร้อยแล้ว'); }
      setName(''); setEditingId(null); await loadTypes();
    } catch (err) { setError(err.response?.data?.message || 'บันทึกประเภทเมนูไม่สำเร็จ'); }
  };

  const remove = async (item) => {
    if (!window.confirm('ต้องการลบประเภท ' + item.name + ' หรือไม่?')) return;
    try { await typeApi.remove(item.typeId); setMessage('ลบประเภทเมนูเรียบร้อยแล้ว'); await loadTypes(); }
    catch (err) { setError(err.response?.data?.message || 'ลบประเภทเมนูไม่สำเร็จ'); }
  };

  return <section><header className='page-heading'><div><p className='eyebrow'>TYPES</p><h2>ประเภทเมนู</h2></div></header>{message && <p className='notice success'>{message}</p>}{error && <p className='notice error'>{error}</p>}<div className='two-column'><form className='form-card' onSubmit={submit}><h3>{editingId ? 'แก้ไขประเภทเมนู' : 'เพิ่มประเภทเมนู'}</h3><label>ชื่อประเภท<input value={name} onChange={(event) => setName(event.target.value)} placeholder='เช่น อาหารจานเดียว' /></label><div className='actions'><button type='submit'>{editingId ? 'บันทึกการแก้ไข' : 'เพิ่มประเภท'}</button>{editingId && <button type='button' className='secondary' onClick={() => { setEditingId(null); setName(''); }}>ยกเลิก</button>}</div></form><div className='list-card'><table><thead><tr><th>รหัส</th><th>ชื่อประเภท</th><th>จัดการ</th></tr></thead><tbody>{types.length ? types.map((item) => <tr key={item.typeId}><td>{item.typeId}</td><td>{item.name}</td><td className='row-actions'><button className='edit' onClick={() => { setEditingId(item.typeId); setName(item.name); }}>แก้ไข</button><button className='danger' onClick={() => remove(item)}>ลบ</button></td></tr>) : <tr><td colSpan='3'>ยังไม่มีประเภทเมนู</td></tr>}</tbody></table></div></div></section>;
}
