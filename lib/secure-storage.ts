import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_KEY || "default-fallback-key";

export const secureStorage = {
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    try {
      const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
    }
  },

  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      return originalText || null;
    } catch (e) {
      return null;
    }
  },

  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
};