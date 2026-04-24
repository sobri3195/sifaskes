import { seedFacilities } from '../data/seedFacilities';

const STORAGE_KEY = 'sifaskes.facilities.v1';

export const initializeFacilities = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFacilities));
    return [...seedFacilities];
  }

  try {
    return JSON.parse(existing);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFacilities));
    return [...seedFacilities];
  }
};

export const saveFacilities = (facilities) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities));
};

export const getFacilities = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};
