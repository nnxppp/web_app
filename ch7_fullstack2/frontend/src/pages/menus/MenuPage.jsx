import { useEffect, useState } from 'react';
import { menuApi, typeApi } from '../../services/restaurantApi.js';

const emptyForm = { name: '', price: '', isBestSeller: false, typeId: '' };

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async (keyword = search) => {
    setLoading(true);
    setError('');
    try {
      const [menuData, typeData] = await Promise.all([
        menuApi.getAll(keyword.trim() ? { search: keyword.trim() } : undefined),
        typeApi.getAll(),
      ]);
      setMenus(menuData);
      setTypes(typeData);
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถเชื่อมต่อ Restaurant Backend API ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(''); }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!form.name.trim() || !form.price || !form.typeId) {
      setError('กรุณากรอกชื่อ ราคา และประเภทเมนูให้ครบ');
      return;
    }
    const payload = { ...form, price: Number(form.price), typeId: Number(form.typeId) };
    try {
      if (editingId) {
        await menuApi.update(editingId, payload);
        setMessage('อัปเดตเมนูเรียบร้อยแล้ว');
      } else {
        await menuApi.create(payload);
        setMessage('เพิ่มเมนูเรียบร้อยแล้ว');
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'บันทึกเมนูไม่สำเร็จ');
    }
  };

  const editMenu = (menu) => {
    setEditingId(menu.menuId);
    setForm({ name: menu.name, price: String(menu.price), isBestSeller: menu.isBestSeller, typeId: String(menu.typeId) });
    setMessage('');
    setError('');
  };

  const deleteMenu = async (menu) => {
    if (!window.confirm('ต้องการลบเมนู ' + menu.name + ' หรือไม่?')) return;
    setMessage('');
    setError('');
    try {
      await menuApi.remove(menu.menuId);
      setMessage('ลบเมนูเรียบร้อยแล้ว');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'ลบเมนูไม่สำเร็จ');
    }
  };

  return (
    <section>
      <header className='page-heading'><div><p className='eyebrow'>MENU</p><h2>รายการอาหาร</h2></div></header>
      {message && <p className='notice success'>{message}</p>}
      {error && <p className='notice error'>{error}</p>}
      <div className='two-column'>
        <form className='form-card' onSubmit={handleSubmit}>
          <h3>{editingId ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</h3>
          <label>ชื่อเมนู<input name='name' value={form.name} onChange={handleChange} placeholder='เช่น ข้าวผัดกุ้ง' /></label>
          <label>ราคา<input name='price' type='number' min='0' step='0.01' value={form.price} onChange={handleChange} placeholder='0.00' /></label>
          <label>ประเภทเมนู<select name='typeId' value={form.typeId} onChange={handleChange}><option value=''>เลือกประเภท</option>{types.map((item) => <option key={item.typeId} value={item.typeId}>{item.name}</option>)}</select></label>
          <label className='checkbox'><input name='isBestSeller' type='checkbox' checked={form.isBestSeller} onChange={handleChange} /> เมนูแนะนำ</label>
          <div className='actions'><button type='submit'>{editingId ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}</button>{editingId && <button className='secondary' type='button' onClick={resetForm}>ยกเลิก</button>}</div>
        </form>
        <div className='list-card'>
          <div className='search'><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='ค้นหาชื่อเมนู' /><button onClick={() => loadData()}>ค้นหา</button></div>
          {loading ? <p>กำลังโหลดข้อมูล...</p> : <table><thead><tr><th>เมนู</th><th>ประเภท</th><th>ราคา</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>{menus.length ? menus.map((menu) => <tr key={menu.menuId}><td>{menu.name}</td><td>{menu.type?.name || '-'}</td><td>{Number(menu.price).toFixed(2)}</td><td>{menu.isBestSeller ? 'แนะนำ' : '-'}</td><td className='row-actions'><button className='edit' onClick={() => editMenu(menu)}>แก้ไข</button><button className='danger' onClick={() => deleteMenu(menu)}>ลบ</button></td></tr>) : <tr><td colSpan='5'>ยังไม่มีรายการเมนู</td></tr>}</tbody></table>}
        </div>
      </div>
    </section>
  );
}
