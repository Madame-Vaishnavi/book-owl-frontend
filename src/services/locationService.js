/**
 * Location Service
 * Uses browser Geolocation API and OpenStreetMap Nominatim for reverse geocoding
 */

export const locationService = {
  /**
   * Get user's current location coordinates
   * @returns {Promise<{latitude: number, longitude: number}>}
   */
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  /**
   * Reverse geocode coordinates to get address
   * Uses OpenStreetMap Nominatim API (free, no API key required)
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<string>} Formatted address string
   */
  reverseGeocode: async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BookOwl-Frontend/1.0' // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      
      if (!data || !data.address) {
        throw new Error('Address not found');
      }

      // Format address from OpenStreetMap response
      const addr = data.address;
      const addressParts = [];

      // Build address in order: house number + street, city, state, postal code, country
      if (addr.house_number && addr.road) {
        addressParts.push(`${addr.house_number} ${addr.road}`);
      } else if (addr.road) {
        addressParts.push(addr.road);
      }

      if (addr.city || addr.town || addr.village) {
        addressParts.push(addr.city || addr.town || addr.village);
      }

      if (addr.state) {
        addressParts.push(addr.state);
      }

      if (addr.postcode) {
        addressParts.push(addr.postcode);
      }

      if (addr.country) {
        addressParts.push(addr.country);
      }

      return addressParts.join(', ') || data.display_name || 'Address not available';
    } catch (error) {
      throw new Error(`Failed to get address: ${error.message}`);
    }
  },

  /**
   * Get user's address automatically using geolocation
   * @returns {Promise<string>} Formatted address string
   */
  getCurrentAddress: async () => {
    try {
      const position = await locationService.getCurrentPosition();
      const address = await locationService.reverseGeocode(
        position.latitude,
        position.longitude
      );
      return address;
    } catch (error) {
      throw error;
    }
  }
};

