class Generators {
  /**
   * Generate a random verification code
   * @param {number} length - Length of the verification code (default: 6)
   * @returns {string} Generated verification code
   */
  generateVerificationCode(length = 6) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let verificationCode = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      verificationCode += characters[randomIndex];
    }
    
    return verificationCode;
  }

  /**
   * Generate a random password
   * @param {number} length - Length of the password (default: 12)
   * @returns {string} Generated password
   */
  generatePassword(length = 12) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allCharacters = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = 4; i < length; i++) {
      password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Generate a unique identifier
   * @param {string} prefix - Optional prefix for the ID
   * @returns {string} Generated unique ID
   */
  generateUniqueId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return prefix + timestamp + random;
  }
}

module.exports = new Generators();