import React from 'react';

interface InputColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  name?: string;
  error?: boolean;
  helperText?: string;
}

const InputColorPicker: React.FC<InputColorPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  name,
  error = false,
  helperText = '',
}) => {
  // Handler for color input (always hex)
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: '100%' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          marginBottom: 4,
          fontWeight: 500,
          fontSize: 15,
          color: error ? '#d32f2f' : '#222',
        }}
      >
        {label}
      </label>
      <input
        type="color"
        value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000'}
        onChange={handleColorChange}
        disabled={disabled}
        name={name}
        style={{
          width: '100%',
          height: 56,
          border: error ? '1.5px solid #d32f2f' : '1.5px solid #ccc',
          borderRadius: 8,
          background: disabled ? '#f5f5f5' : undefined,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: error ? '2px solid #d32f2f' : undefined,
          boxSizing: 'border-box',
          padding: 0,
          display: 'block',
        }}
        tabIndex={-1}
      />
      {helperText && (
        <div style={{ color: error ? '#d32f2f' : '#888', fontSize: 13, marginLeft: 2, minHeight: 18 }}>{helperText}</div>
      )}
    </div>
  );
};

export default InputColorPicker; 