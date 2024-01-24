import EnumsError from "../utils/EnumsError.js";

export default (error, req, res, next) => {
  req.logger.log('error', error)
  switch (error.code) {
    case EnumsError.BAD_REQUEST_ERROR:
    case EnumsError.INVALID_TYPE_ERROR:
      res.status(400).json({ status: "error", message: error.message });
      break;
    case EnumsError.DATA_BASE_ERROR:
    case EnumsError.ROUTING_ERROR:
      res.status(500).json({ status: "error", message: error.message });
      break;
      
    default:
      res.status(500).json({ status: "error", message: "Error desconocido" });
      break;
  }
};
