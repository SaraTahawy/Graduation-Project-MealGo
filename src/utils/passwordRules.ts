export const passwordRequirements = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'At least 1 uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    key: 'lowercase',
    label: 'At least 1 lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    key: 'number',
    label: 'At least 1 number',
    test: (password: string) => /\d/.test(password),
  },
  {
    key: 'special',
    label: 'At least 1 special character',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
] as const;

export const getPasswordIssues = (password: string) =>
  passwordRequirements
    .filter((requirement) => !requirement.test(password))
    .map((requirement) => requirement.label);

export const isPasswordStrong = (password: string) =>
  getPasswordIssues(password).length === 0;
