import { create } from 'zustand';

type QrStoreState = {
  activeQrCodes: Record<string, string | null>; // courseId -> qrCodeData
  setQrDataForCourse: (courseId: string, qrData: string | null) => void;
  getQrDataForCourse: (courseId: string) => string | null;
  clearAllQrCodes: () => void;
};

// A simple flag to ensure we only clear state once on startup.
let isInitialized = false;

export const useFacultyQrStore = create<QrStoreState>((set, get) => {
  const initialState = {
    activeQrCodes: {},
    setQrDataForCourse: (courseId: string, qrData: string | null) => {
      set(state => ({
        activeQrCodes: {
          ...state.activeQrCodes,
          [courseId]: qrData,
        },
      }));
    },
    getQrDataForCourse: (courseId: string) => {
      return get().activeQrCodes[courseId] || null;
    },
    clearAllQrCodes: () => {
        set({ activeQrCodes: {} });
    }
  };

  // On initialization of the store, clear any persisted state.
  // This prevents using stale QR codes from previous sessions.
  if (!isInitialized) {
      initialState.activeQrCodes = {};
      isInitialized = true;
  }

  return initialState;
});

// Immediately clear the codes on app load.
useFacultyQrStore.getState().clearAllQrCodes();
