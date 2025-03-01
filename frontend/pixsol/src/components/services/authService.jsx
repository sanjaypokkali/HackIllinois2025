// List of supported universities with their domain patterns
const SUPPORTED_UNIVERSITIES = [
    { id: 'uiuc', name: 'University of Illinois', domains: ['illinois.edu'] },
    { id: 'mit', name: 'Massachusetts Institute of Technology', domains: ['mit.edu'] },
    { id: 'stanford', name: 'Stanford University', domains: ['stanford.edu'] },
    { id: 'berkeley', name: 'UC Berkeley', domains: ['berkeley.edu'] },
    { id: 'harvard', name: 'Harvard University', domains: ['harvard.edu'] },
    { id: 'cmu', name: 'Carnegie Mellon University', domains: ['cmu.edu'] },
    { id: 'gatech', name: 'Georgia Tech', domains: ['gatech.edu'] }
  ];
  
  // Verify university affiliation based on email domain
  export const verifyUniversity = async (email) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !email.includes('@')) {
        return { verified: false, error: 'Invalid email format' };
      }
      
      const domain = email.split('@')[1].toLowerCase();
      
      // Check if the domain matches any supported university
      const university = SUPPORTED_UNIVERSITIES.find(uni => 
        uni.domains.some(uniDomain => domain === uniDomain || domain.endsWith('.' + uniDomain))
      );
      
      if (university) {
        return { 
          verified: true, 
          universityId: university.id,
          universityName: university.name
        };
      }
      
      return { verified: false, error: 'University not supported' };
    } catch (error) {
      console.error('Error verifying university:', error);
      return { verified: false, error: 'Verification failed' };
    }
  };
  
  // Store verification in local storage
  export const storeVerification = (verification) => {
    if (verification && verification.verified) {
      localStorage.setItem('universityVerification', JSON.stringify(verification));
      return true;
    }
    return false;
  };
  
  // Get stored verification
  export const getStoredVerification = () => {
    try {
      const stored = localStorage.getItem('universityVerification');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving stored verification:', error);
      return null;
    }
  };
  
  // Clear stored verification
  export const clearVerification = () => {
    localStorage.removeItem('universityVerification');
  };
  
  // Check if user has access to a specific university's canvas
  export const checkUniversityAccess = (universityId) => {
    const verification = getStoredVerification();
    
    if (!verification || !verification.verified) {
      return false;
    }
    
    // If universityId is not specified, any verified university is fine
    if (!universityId) {
      return true;
    }
    
    // Check if user is verified for the specific university
    return verification.universityId === universityId;
  };
  
  // Send verification code (in a real app, this would email a code)
  export const sendVerificationCode = async (email) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would send an email with a verification code
      console.log(`Sending verification code to ${email}`);
      
      // For development, just generate and return a code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In development, we'll return the code directly
      // In production, this would return a success message only
      return { 
        success: true, 
        message: 'Verification code sent',
        code: code // Remove this in production!
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false, error: 'Failed to send verification code' };
    }
  };
  
  // Verify code (in a real app, this would check the code against what was sent)
  export const verifyCode = async (email, code) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For development, we'll accept any 6-digit code
      // In production, this would validate against a stored code
      if (code && code.length === 6 && /^\d+$/.test(code)) {
        const domain = email.split('@')[1].toLowerCase();
        const university = SUPPORTED_UNIVERSITIES.find(uni => 
          uni.domains.some(uniDomain => domain === uniDomain || domain.endsWith('.' + uniDomain))
        );
        
        if (university) {
          const verification = { 
            verified: true, 
            universityId: university.id,
            universityName: university.name,
            email: email
          };
          
          storeVerification(verification);
          
          return { 
            success: true, 
            verification: verification
          };
        }
      }
      
      return { success: false, error: 'Invalid verification code' };
    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, error: 'Verification failed' };
    }
  };
  