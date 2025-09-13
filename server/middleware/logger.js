const logger = (req, res, next) => {
  console.log('-------------------------------------------------------');
  console.log(`${req.method} ${req.url}`);
  if (Object.keys(req.params).length > 0) { console.log('params:', req.params); }
  if (Object.keys(req.query).length > 0) { console.log('query:', req.query); }
  if (Object.keys(req.body).length > 0) { console.log('body:', req.body); }
  console.log('-------------------------------------------------------');
  next();
};

module.exports = logger;