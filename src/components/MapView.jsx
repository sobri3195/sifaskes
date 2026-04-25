import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const indonesiaCenter = [-2.5, 118];

const totalSdm = (sdm = {}) => Object.values(sdm).reduce((sum, n) => sum + Number(n || 0), 0);

const markerClassByType = {
  'RSAU BLU': 'marker-rsau-blu',
  FKTP: 'marker-fktp',
};

const getFacilityMarkerIcon = (type) =>
  L.divIcon({
    className: `facility-marker ${markerClassByType[type] || 'marker-default'}`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });

function MapFocusHandler({ focusedFacility }) {
  const map = useMap();

  useEffect(() => {
    if (!focusedFacility?.latitude || !focusedFacility?.longitude) {
      return;
    }

    map.flyTo([focusedFacility.latitude, focusedFacility.longitude], Math.max(map.getZoom(), 11), {
      duration: 0.8,
    });
  }, [focusedFacility, map]);

  return null;
}

function MapView({ facilities, onDetail, isFullscreen, onToggleFullscreen, focusedFacility }) {
  return (
    <section className={`map-section ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <div className="map-toolbar">
        <button type="button" onClick={onToggleFullscreen}>
          {isFullscreen ? 'Keluar Full Page Map' : 'Full Page Map'}
        </button>
      </div>

      <MapContainer center={indonesiaCenter} zoom={5} minZoom={4} className="main-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocusHandler focusedFacility={focusedFacility} />

        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            icon={getFacilityMarkerIcon(facility.type)}
          >
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
    </section>
  );
}

export default MapView;
