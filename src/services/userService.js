const userRepository = require('../repositories/userRepository');
const { ApiError } = require('../utils/apiError');

function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

function getAllUsers() {
  return userRepository.findAll().map(sanitize);
}

function getUserById(id) {
  const user = userRepository.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sanitize(user);
}

function findUserRecordByEmail(email) {
  return userRepository.findByEmail(email);
}

function createUser(payload, options = {}) {
  const { name, email, role = 'user', password } = payload;

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }

  if (userRepository.findByEmail(email)) {
    throw new ApiError(409, 'Email already in use');
  }

  const existingUsers = userRepository.findAll();
  const nextId = existingUsers.length > 0 ? Math.max(...existingUsers.map((user) => user.id)) + 1 : 1;
  const user = { id: nextId, name, email, role };

  if (options.storePassword && password) {
    user.password = password;
  }

  return sanitize(userRepository.create(user));
}

function updateUser(id, payload) {
  const currentUser = userRepository.findById(id);

  if (!currentUser) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.email && payload.email !== currentUser.email && userRepository.findByEmail(payload.email)) {
    throw new ApiError(409, 'Email already in use');
  }

  const updatedUser = {
    ...currentUser,
    ...payload,
    id: currentUser.id,
  };

  return sanitize(userRepository.update(id, updatedUser));
}

function deleteUser(id) {
  const deletedUser = userRepository.remove(id);

  if (!deletedUser) {
    throw new ApiError(404, 'User not found');
  }

  return sanitize(deletedUser);
}

module.exports = {
  getAllUsers,
  getUserById,
  findUserRecordByEmail,
  createUser,
  updateUser,
  deleteUser,
};
