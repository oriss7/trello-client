import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({ type, placeholder, value, onChange, showError, 
                      min, max, disabled, isGuestUser = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  };

  let message = ''

  const isEmail = placeholder.toLowerCase() === 'email';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isName = placeholder.toLowerCase() === 'name';
  const nameRegex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
  const isPassword = placeholder.toLowerCase() === 'password';
  const passwordRegex = /[\s<>{}=%]/;

  // --- Input filtering ---
  const handleChange = (e) => {
    const val = e.target.value;

    if (isName && /[^a-zA-Z0-9 ]/.test(val)) return;
    if (isEmail && /[^a-zA-Z0-9@._-]/.test(val)) return; // stricter real-time filter
    if (isPassword && passwordRegex.test(val)) return;
  
    onChange(e);
  };

  // if (isEmail && value?.trim().toLowerCase() === 'guest@gmail.com') {
  if (isGuestUser) {
    message = 'Guest account cannot change email'
  }

  if (showError) {
    if (!value) {
      message = `${placeholder} can't be empty`
    } else if (isEmail && !emailRegex.test(value)) {
      message = 'Please enter a valid email address'
    } else if (isName && !nameRegex.test(value)) {
      message = 'Name can only contain letters, numbers, and spaces (but no multiple spaces in a row)'
    } else if (isPassword && passwordRegex.test(value)) {
      message = 'Password cannot contain spaces or the following special characters: < > { } = %'
    } else if (value.length < min) {
      message = `${placeholder} can't be shorter than ${min}`
    } else if (value.length > max) {
      message = `${placeholder} can't be longer than ${max}`
    }
  }

  const EyeIcon = isPassword ? (showPassword ? EyeOff : Eye) : null

  return (
    <div className='inputWrapper'>
      <input type={isPassword && showPassword ? 'text' : type} placeholder={placeholder}
              value={value} onChange={handleChange} maxLength={max} disabled={disabled}/>
      {EyeIcon && (
        <EyeIcon onClick={togglePasswordVisibility}
        className="pointer toggle-password-icon"/>)}
      <p className="inputError" style={{ visibility: message ? 'visible' : 'hidden' }}>
        {message}</p>
    </div>
  )
}

export default FormInput;