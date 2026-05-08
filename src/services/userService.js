const users = require('../database/userDatabase');
const { ApiError } = require('../utils/apiError');

function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

function getAllUsers() {
  return users.map(sanitize);
}

function getUserById(id) {
  const userId = Number(id);
  const user = users.find((item) => item.id === userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sanitize(user);
}

function createUser(payload) {
  const { name, email, password } = payload;

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }

  if (users.find((u) => u.email === email)) {
    throw new ApiError(409, 'Email already in use');
  }

  const nextId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
  const user = { id: nextId, name, email, role: payload.role || 'user' };

  if (password) user.password = password;

  users.push(user);
  return sanitize(user);
}

function updateUser(id, payload) {
  const userId = Number(id);
  const userIndex = users.findIndex((item) => item.id === userId);

  if (userIndex === -1) {
    throw new ApiError(404, 'User not found');
  }

  const currentUser = users[userIndex];
  const updatedUser = {
    ...currentUser,
    ...payload,
    id: currentUser.id,
  };

  users[userIndex] = updatedUser;
  return sanitize(updatedUser);
}

function deleteUser(id) {
  const userId = Number(id);
  const userIndex = users.findIndex((item) => item.id === userId);

  if (userIndex === -1) {
    throw new ApiError(404, 'User not found');
  }

  const [deletedUser] = users.splice(userIndex, 1);
  return sanitize(deletedUser);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
