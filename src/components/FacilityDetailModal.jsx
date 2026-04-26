import { MapContainer, Marker, TileLayer } from 'react-leaflet';

const totalSdm = (sdm = {}) => Object.values(sdm).reduce((sum, n) => sum + Number(n || 0), 0);

function FacilityDetailModal({ facility, onClose, onEdit, onDelete, canEdit, onRequireLogin }) {
  if (!facility) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>{facility.name}</h2>
        <p>
          <strong>Jenis:</strong> {facility.type}
        </p>
        <p>
          <strong>Jajaran:</strong> {facility.jajaran}
        </p>
        <p>
          <strong>Alamat:</strong> {facility.address || '-'}
        </p>
        <p>
          <strong>Profil singkat:</strong> {facility.profileNote || '-'}
        </p>
        <p>
          <strong>Akreditasi:</strong> {facility.accreditation || '-'}
        </p>
        <p>
          <strong>Jumlah bed:</strong> {facility.bedCount || 0}
        </p>
        <p>
          <strong>Total SDM:</strong> {totalSdm(facility.sdm)}
        </p>
        <p>
          <strong>Status koordinat:</strong> {facility.isCoordinateEstimated ? 'Estimasi' : 'Validasi'}
        </p>

        <ul>
          <li>Dokter umum: {facility.sdm?.dokterUmum || 0}</li>
          <li>Dokter gigi: {facility.sdm?.dokterGigi || 0}</li>
          <li>Perawat: {facility.sdm?.perawat || 0}</li>
          <li>Bidan: {facility.sdm?.bidan || 0}</li>
          <li>Apoteker: {facility.sdm?.apoteker || 0}</li>
          <li>Tenaga administrasi: {facility.sdm?.tenagaAdministrasi || 0}</li>
          <li>Tenaga lainnya: {facility.sdm?.tenagaLainnya || 0}</li>
        </ul>

        <MapContainer
          center={[facility.latitude, facility.longitude]}
          zoom={12}
          className="mini-map"
          dragging={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[facility.latitude, facility.longitude]} />
        </MapContainer>

        <div className="actions">
          <button type="button" onClick={() => (canEdit ? onEdit(facility) : onRequireLogin())}>
            Edit
          </button>
          <button type="button" className="danger" onClick={() => onDelete(facility.id)}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacilityDetailModal;
