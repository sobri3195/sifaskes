import { seedFacilities } from '../data/seedFacilities';

const STORAGE_KEY = 'sifaskes.facilities.v1';

const normalizeFacility = (facility) => ({
  ...facility,
  accreditation: facility.accreditation || '',
  bedCount: Number(facility.bedCount || 0),
  sdm: {
    dokterUmum: Number(facility.sdm?.dokterUmum || 0),
    dokterGigi: Number(facility.sdm?.dokterGigi || 0),
    perawat: Number(facility.sdm?.perawat || 0),
    bidan: Number(facility.sdm?.bidan || 0),
    apoteker: Number(facility.sdm?.apoteker || 0),
    tenagaAdministrasi: Number(facility.sdm?.tenagaAdministrasi || 0),
    tenagaLainnya: Number(facility.sdm?.tenagaLainnya || 0),
  },
  profileNote: facility.profileNote || '',
});

export const initializeFacilities = () => {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFacilities));
    return [...seedFacilities];
  }

  try {
    const parsed = JSON.parse(existing);
    const normalized = Array.isArray(parsed) ? parsed.map(normalizeFacility) : [...seedFacilities];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFacilities));
    return [...seedFacilities];
  }
};

export const saveFacilities = (facilities) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities));
};
