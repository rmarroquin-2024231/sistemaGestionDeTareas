import { useId } from 'react';
import './FormField.css';

const FormField = ({ label, error, type = 'text', autoComplete, ...inputProps }) => {
  const id = useId();

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <div className="field__label-row">
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      </div>
      <div className="field__input-row">
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          className="field__input"
          {...inputProps}
        />
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export default FormField;
