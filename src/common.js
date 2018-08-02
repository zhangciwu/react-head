export const isBrowser =
  typeof window !== 'undefined' &&
  {}.toString.call(window) === '[object Window]';
