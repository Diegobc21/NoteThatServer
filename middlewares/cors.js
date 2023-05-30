const corsOptions = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next();
}

export default corsOptions
