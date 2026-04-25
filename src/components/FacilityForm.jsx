import { useEffect, useState } from 'react';
import { facilityTypeOptions, jajaranOptions } from '../data/seedFacilities';

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

const sdmLabels = {
  dokterUmum: 'Dokter umum',
  dokterGigi: 'Dokter gigi',
  perawat: 'Perawat',
  bidan: 'Bidan',
  apoteker: 'Apoteker',
  tenagaAdministrasi: 'Tenaga administrasi',
  tenagaLainnya: 'Tenaga lainnya',
};

function FacilityForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(defaultValue);

  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultValue, ...initialData, sdm: { ...defaultValue.sdm, ...(initialData.sdm || {}) } });
      return;
    }
    setForm(defaultValue);
  }, [initialData]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateSdm = (field, value) =>
    setForm((prev) => ({
      ...prev,
      sdm: {
        ...prev.sdm,
        [field]: Number(value),
      },
    }));

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

      <label>
        Nama fasilitas
        <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} />
      </label>

      <div className="grid-2">
        <label>
          Jenis fasilitas
          <select value={form.type} onChange={(event) => updateField('type', event.target.value)}>
            {facilityTypeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Jajaran
          <select value={form.jajaran} onChange={(event) => updateField('jajaran', event.target.value)}>
            {jajaranOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Alamat
        <input value={form.address} onChange={(event) => updateField('address', event.target.value)} />
      </label>

      <div className="grid-2">
        <label>
          Latitude
          <input
            required
            type="number"
            step="any"
            value={form.latitude}
            onChange={(event) => updateField('latitude', event.target.value)}
          />
        </label>

        <label>
          Longitude
          <input
            required
            type="number"
            step="any"
            value={form.longitude}
            onChange={(event) => updateField('longitude', event.target.value)}
          />
        </label>
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.isCoordinateEstimated}
          onChange={(event) => updateField('isCoordinateEstimated', event.target.checked)}
        />
        Koordinat masih estimasi
      </label>

      <div className="grid-2">
        <label>
          Akreditasi
          <input value={form.accreditation} onChange={(event) => updateField('accreditation', event.target.value)} />
        </label>

        <label>
          Jumlah bed
          <input type="number" min="0" value={form.bedCount} onChange={(event) => updateField('bedCount', event.target.value)} />
        </label>
      </div>

      <fieldset>
        <legend>Data SDM</legend>
        <div className="grid-2">
          {Object.keys(form.sdm).map((key) => (
            <label key={key}>
              {sdmLabels[key]}
              <input
                type="number"
                min="0"
                value={form.sdm[key]}
                onChange={(event) => updateSdm(key, event.target.value)}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Catatan profil singkat
        <textarea value={form.profileNote} onChange={(event) => updateField('profileNote', event.target.value)} />
      </label>

      <div className="actions">
        <button type="submit">Simpan</button>
        <button type="button" onClick={onCancel}>
          Batal
        </button>
      </div>
    </form>
  );
}

export default FacilityForm;
