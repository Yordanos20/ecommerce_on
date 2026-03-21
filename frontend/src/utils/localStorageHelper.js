// Robust localStorage helper with fallbacks and error handling

export const localStorageHelper = {
  // Set item with error handling
  setItem: (key, value) => {
    try {
      console.log(`🔧 Setting ${key}:`, value);
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`✅ Successfully set ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error setting ${key}:`, error);
      // Fallback to sessionStorage
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        console.log(`✅ Fallback: Set ${key} in sessionStorage`);
        return true;
      } catch (sessionError) {
        console.error(`❌ Even sessionStorage failed for ${key}:`, sessionError);
        return false;
      }
    }
  },

  // Get item with error handling
  getItem: (key) => {
    try {
      console.log(`🔧 Getting ${key}...`);
      const item = localStorage.getItem(key);
      console.log(`🔧 Raw ${key} data:`, item);
      
      if (item === null) {
        console.log(`⚠️ ${key} not found in localStorage, trying sessionStorage...`);
        const sessionItem = sessionStorage.getItem(key);
        console.log(`🔧 Raw ${key} from sessionStorage:`, sessionItem);
        
        if (sessionItem === null) {
          console.log(`⚠️ ${key} not found anywhere, returning empty array`);
          return [];
        }
        
        const parsed = JSON.parse(sessionItem);
        console.log(`✅ Successfully got ${key} from sessionStorage:`, parsed);
        return parsed;
      }
      
      const parsed = JSON.parse(item);
      console.log(`✅ Successfully got ${key} from localStorage:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`❌ Error getting ${key}:`, error);
      return [];
    }
  },

  // Remove item
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      console.log(`✅ Removed ${key} from both storages`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${key}:`, error);
      return false;
    }
  },

  // Clear all
  clear: () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log(`✅ Cleared both storages`);
      return true;
    } catch (error) {
      console.error(`❌ Error clearing storages:`, error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      console.log('✅ localStorage is available');
      return true;
    } catch (error) {
      console.error('❌ localStorage is not available:', error);
      return false;
    }
  }
};

// Initialize with availability check
console.log('🔧 localStorageHelper initialized');
// localStorageHelper.isAvailable();
