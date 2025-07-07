const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const validatePassword = (password: string): boolean => {
  return password.length > 6;
};

export { validateEmail, validatePassword };