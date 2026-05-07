exports.getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'Healthy',
    timestamp: Date.now(),
  });
};
