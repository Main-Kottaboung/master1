const users = require('../database/userDatabase');

function findAll() {
  return users;
}

function findById(id) {
  const userId = Number(id);
  return users.find((user) => user.id === userId) || null;
}

function findByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

function create(user) {
  users.push(user);
  return user;
}

function update(id, nextUser) {
  const userId = Number(id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = nextUser;
  return users[userIndex];
}

function remove(id) {
  const userId = Number(id);
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  const [deletedUser] = users.splice(userIndex, 1);
  return deletedUser;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
};
