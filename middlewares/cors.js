const corsOptions = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Reemplaza con el origen de tu cliente Angular
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
}

export default corsOptions
