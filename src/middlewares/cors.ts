const corsOptions = (req: any, res: any, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );
  next();
}

export default corsOptions
