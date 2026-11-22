import React from 'react';
import { Loader2 } from 'lucide-react';

const SubmitButton = ({ text, isLoading }) => {
  return (
    <button type="submit" className="submit-btn" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 size={18} className="spinner" />
          <span>Connexion en cours...</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default SubmitButton;