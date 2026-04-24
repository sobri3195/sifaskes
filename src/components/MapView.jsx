import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const indonesiaCenter = [-2.5, 118];

const totalSdm = (sdm = {}) => Object.values(sdm).reduce((sum, n) => sum + Number(n || 0), 0);

function MapView({ facilities, onDetail }) {
  return (
    <MapContainer center={indonesiaCenter} zoom={5} minZoom={4} className="main-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {facilities.map((facility) => (
        <Marker key={facility.id} position={[facility.latitude, facility.longitude]}>
          <Popup>
            <div className="popup-content">
              <h4>{facility.name}</h4>
              <p>Jenis: {facility.type}</p>
              <p>Jajaran: {facility.jajaran}</p>
              <p>Akreditasi: {facility.accreditation || '-'}</p>
              <p>Bed: {facility.bedCount || 0}</p>
              <p>SDM: {totalSdm(facility.sdm)}</p>
              <button type="button" onClick={() => onDetail(facility)}>Lihat Detail</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
