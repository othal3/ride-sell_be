const logger = (req, res, next) => {
   const { url, ip, method } = req;

   console.log(
      `${new Date().toISOString()} ${method} Request to ${url} from ${ip}`
   );

   next();
};

module.exports = logger;
