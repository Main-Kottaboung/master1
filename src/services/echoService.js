exports.echo = async (body) => {
  // In production this might call other services or validate payloads
  return { echoed: body };
};
