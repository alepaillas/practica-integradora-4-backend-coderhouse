export const userResponseDto = (user) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    email: user.email,
  };
};
