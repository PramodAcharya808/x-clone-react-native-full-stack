export const sendSuccess = (
  res,
  message = "Success",
  data = {},
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res,
  error = "Something went wrong",
  status = 500
) => {
  return res.status(status).json({
    success: false,
    message: error instanceof Error ? error.message : error,
  });
};
