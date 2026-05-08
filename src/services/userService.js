const userRepository = require('../repositories/userRepository');
const { ApiError } = require('../utils/apiError');

function sanitize(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

async function getAllUsers() {
  const users = await userRepository.findAll();
  return users.map(sanitize);
}

async function getUserById(id) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sanitize(user);
}

async function findUserRecordByEmail(email) {
  return userRepository.findByEmail(email);
}

async function createUser(payload, options = {}) {
  const { name, email, role = 'user', password } = payload;

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(409, 'Email already in use');
  }

  const data = { name, email, role };
  if (options.storePassword && password) {
    data.password = password;
  }

  const created = await userRepository.create(data);
  return sanitize(created);
}

async function updateUser(id, payload) {
  const currentUser = await userRepository.findById(id);

  if (!currentUser) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.email && payload.email !== currentUser.email) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) throw new ApiError(409, 'Email already in use');
  }

  // Remove password from payload - password should not be updatable through regular update endpoint
  const { password, ...updateData } = payload;

  const updated = await userRepository.update(id, updateData);
  if (!updated) throw new ApiError(404, 'User not found');
  return sanitize(updated);
}

async function deleteUser(id) {
  const deletedUser = await userRepository.remove(id);

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
