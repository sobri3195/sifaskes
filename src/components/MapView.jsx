import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const indonesiaCenter = [-2.5, 118];

const totalSdm = (sdm = {}) => Object.values(sdm).reduce((sum, n) => sum + Number(n || 0), 0);

function MapFocusHandler({ focusedFacility }) {
  const map = useMap();

  useEffect(() => {
    if (!focusedFacility?.latitude || !focusedFacility?.longitude) {
      return;
    }

    map.flyTo([focusedFacility.latitude, focusedFacility.longitude], Math.max(8, map.getZoom()), {
      duration: 1,
    });
  }, [focusedFacility, map]);

  return null;
}

function MapView({ facilities, onDetail, focusedFacility }) {
  return (
    <section className="map-section">
      <MapContainer center={indonesiaCenter} zoom={5} minZoom={4} className="main-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocusHandler focusedFacility={focusedFacility} />

        {facilities.map((facility) => (
          <Marker key={facility.id} position={[facility.latitude, facility.longitude]}>
            <Popup>
              <div className="popup-content">
                <h4>{facility.name}</h4>
                <p>Jenis: {facility.type}</p>
                <p>Jajaran: {facility.jajaran}</p>
                <p>Akreditasi: {facility.accreditation || '-'}</p>
                <p>Jumlah bed: {facility.bedCount || 0}</p>
                <p>Jumlah SDM: {totalSdm(facility.sdm)}</p>
                <button type="button" onClick={() => onDetail(facility)}>
                  Lihat Detail
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}

export default MapView;
