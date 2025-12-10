// lib/secure-storage.ts
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-fallback-key";

export const secureStorage = {
  /**
   * Encrypts a value and saves it to LocalStorage
   */
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return; // Guard for server-side rendering
    try {
      const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error("Encryption error", e);
    }
  },

  /**
   * Retrieves and decrypts a value from LocalStorage
   */
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      return originalText || null;
    } catch (e) {
      console.error("Decryption error", e);
      return null;
    }
  },

  /**
   * Removes item from LocalStorage
   */
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
};