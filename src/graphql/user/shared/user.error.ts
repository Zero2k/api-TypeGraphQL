import { createError } from 'apollo-errors';

export const WrongCredentialsError = createError('WrongCredentialsError', {
  message: 'The provided credentials are invalid.'
});

export const NoUserExistsError = createError('NoUserExistsError', {
  message: 'No user exist with that email or id.'
});

export const UserExistsError = createError('UserExistsError', {
  message: 'User already exists.'
});

export const InvalidTokenError = createError('InvalidTokenError', {
  message: 'Password reset token is invalid or has expired.'
});

export const InvalidEmailError = createError('InvalidEmailError', {
  message: 'Email is not valid.'
});

export const PasswordMismatch = createError('PasswordMismatch', {
  message: 'Password did not match.'
});
