import React, { useState } from 'react';
import { verifyUniversity } from '../services/authService';

function UniversityVerification() {
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await verifyUniversity(email);
      setIsVerified(result.verified);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="university-verification">
      <h3>Verify University Affiliation</h3>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your university email"
      />
      <button onClick={handleVerify} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
      
      {error && <p className="error">{error}</p>}
      {isVerified && <p className="success">Verification successful!</p>}
    </div>
  );
}

export default UniversityVerification;
