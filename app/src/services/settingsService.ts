import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { CompanySettings } from '../types';

const SETTINGS_DOC_REF = doc(db, 'company', 'settings');

// Default settings if none exist in DB
const DEFAULT_SETTINGS: CompanySettings = {
    name: 'EncoderBytes',
    address: 'IT Park, Peshawar, Pakistan',
    phone: '+92-51-1234567',
    email: 'info@encoderbytes.com',
    primaryColor: '#5d88c6',
    currency: '',
    taxPercentage: 0
};

export const settingsAPI = {
  // 1. Get Settings
  get: async (): Promise<CompanySettings> => {
    try {
      const docSnap = await getDoc(SETTINGS_DOC_REF);
      if (docSnap.exists()) {
        return docSnap.data() as CompanySettings;
      } else {
        // If no settings exist yet, create default ones
        await setDoc(SETTINGS_DOC_REF, DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      return DEFAULT_SETTINGS;
    }
  },

  // 2. Update Settings
  update: async (settings: CompanySettings): Promise<CompanySettings> => {
    try {
      // Use setDoc with merge: true to update fields without overwriting everything
      await setDoc(SETTINGS_DOC_REF, settings, { merge: true });
      return settings;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }
};