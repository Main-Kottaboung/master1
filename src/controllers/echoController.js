const echoService = require('../services/echoService');

exports.echo = async (req, res, next) => {
  try {
    const result = await echoService.echo(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};
