const totalSdm = (sdm = {}) => Object.values(sdm).reduce((sum, value) => sum + Number(value || 0), 0);

function FacilityCard({ facility, onDetail, onFocus }) {
  return (
    <article className="facility-card">
      <h3>{facility.name}</h3>
      <p>
        <strong>Jenis:</strong> {facility.type}
      </p>
      <p>
        <strong>Jajaran:</strong> {facility.jajaran}
      </p>
      <p>
        <strong>Akreditasi:</strong> {facility.accreditation || '-'}
      </p>
      <p>
        <strong>Bed:</strong> {facility.bedCount || 0}
      </p>
      <p>
        <strong>Total SDM:</strong> {totalSdm(facility.sdm)}
      </p>

      <div className="actions">
        <button type="button" onClick={() => onFocus(facility)}>
          Fokus ke Peta
        </button>
        <button type="button" onClick={() => onDetail(facility)}>
          Lihat Detail
        </button>
      </div>
    </article>
  );
}

export default FacilityCard;
