import { useEffect, useState } from 'react';
import { jajaranOptions } from '../data/seedFacilities';

const defaultValue = {
  name: '',
  type: 'FKTP',
  jajaran: 'Kodau I',
  address: '',
  latitude: -2.5,
  longitude: 118,
  isCoordinateEstimated: true,
  accreditation: '',
  bedCount: 0,
  profileNote: '',
  sdm: {
    dokterUmum: 0,
    dokterGigi: 0,
    perawat: 0,
    bidan: 0,
    apoteker: 0,
    tenagaAdministrasi: 0,
    tenagaLainnya: 0,
  },
};

function FacilityForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(defaultValue);

  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultValue, ...initialData, sdm: { ...defaultValue.sdm, ...(initialData.sdm || {}) } });
    } else {
      setForm(defaultValue);
    }
  }, [initialData]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateSdm = (field, value) => setForm((prev) => ({ ...prev, sdm: { ...prev.sdm, [field]: Number(value) } }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      bedCount: Number(form.bedCount),
    });
  };

  return (
    <form className="facility-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Fasilitas' : 'Tambah Fasilitas'}</h3>
      <label>Nama fasilitas<input required value={form.name} onChange={(e) => updateField('name', e.target.value)} /></label>
      <label>Jenis fasilitas
        <select value={form.type} onChange={(e) => updateField('type', e.target.value)}>
          <option>RSAU PNBP</option><option>RSAU BLU</option><option>FKTP</option>
        </select>
      </label>
      <label>Jajaran
        <select value={form.jajaran} onChange={(e) => updateField('jajaran', e.target.value)}>
          {jajaranOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>Alamat<input value={form.address} onChange={(e) => updateField('address', e.target.value)} /></label>
      <div className="grid-2">
        <label>Latitude<input type="number" step="any" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} /></label>
        <label>Longitude<input type="number" step="any" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} /></label>
      </div>
      <label className="checkbox"><input type="checkbox" checked={form.isCoordinateEstimated} onChange={(e) => updateField('isCoordinateEstimated', e.target.checked)} />Koordinat estimasi</label>
      <div className="grid-2">
        <label>Akreditasi<input value={form.accreditation} onChange={(e) => updateField('accreditation', e.target.value)} /></label>
        <label>Jumlah bed<input type="number" value={form.bedCount} onChange={(e) => updateField('bedCount', e.target.value)} /></label>
      </div>
      <fieldset>
        <legend>Data SDM</legend>
        <div className="grid-2">
          {Object.keys(form.sdm).map((key) => (
            <label key={key}>{key}<input type="number" value={form.sdm[key]} onChange={(e) => updateSdm(key, e.target.value)} /></label>
          ))}
        </div>
      </fieldset>
      <label>Catatan profil singkat<textarea value={form.profileNote} onChange={(e) => updateField('profileNote', e.target.value)} /></label>
      <div className="actions">
        <button type="submit">Simpan</button>
        <button type="button" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}

export default FacilityForm;
