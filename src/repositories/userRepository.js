const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findAll() {
  return prisma.user.findMany();
}

async function findById(id) {
  const userId = Number(id);
  return prisma.user.findUnique({ where: { id: userId } });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function create(user) {
  return prisma.user.create({ data: user });
}

async function update(id, nextUser) {
  const userId = Number(id);
  try {
    return await prisma.user.update({ where: { id: userId }, data: nextUser });
  } catch (err) {
    return null;
  }
}

async function remove(id) {
  const userId = Number(id);
  try {
    return await prisma.user.delete({ where: { id: userId } });
  } catch (err) {
    return null;
  }
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
};
