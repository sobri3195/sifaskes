function totalSdm(sdm = {}) {
  return Object.values(sdm).reduce((acc, item) => acc + Number(item || 0), 0);
}

function FacilityCard({ facility, onDetail }) {
  return (
    <article className="facility-card">
      <h3>{facility.name}</h3>
      <p><strong>Jenis:</strong> {facility.type}</p>
      <p><strong>Jajaran:</strong> {facility.jajaran}</p>
      <p><strong>Akreditasi:</strong> {facility.accreditation || '-'}</p>
      <p><strong>Bed:</strong> {facility.bedCount || 0}</p>
      <p><strong>SDM:</strong> {totalSdm(facility.sdm)}</p>
      {facility.isCoordinateEstimated && <small>Koordinat masih estimasi</small>}
      <button type="button" onClick={() => onDetail(facility)}>Lihat Detail</button>
    </article>
  );
}

export default FacilityCard;
