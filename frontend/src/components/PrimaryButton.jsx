import './PrimaryButton.css';

const PrimaryButton = ({ children, isLoading = false, type = 'submit', ...props }) => {
  return (
    <button type={type} className="btn-primary" disabled={isLoading} {...props}>
      <span className={isLoading ? 'btn-primary__label btn-primary__label--hidden' : 'btn-primary__label'}>
        {children}
      </span>
      {isLoading && <span className="btn-primary__spinner" aria-hidden="true" />}
    </button>
  );
};

export default PrimaryButton;
