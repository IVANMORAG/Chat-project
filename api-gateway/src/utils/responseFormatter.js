const responseFormatter = (req, res, next) => {
    const originalJson = res.json;
  
    res.json = (data) => {
      const formattedData = {
        success: true,
        data: data
      };
      originalJson.call(res, formattedData);
    };
  
    next();
  };
  
  module.exports = responseFormatter;