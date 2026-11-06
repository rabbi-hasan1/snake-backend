export const asyncHandler = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({
      message: err?.message || "internal server error" ,
    });
  }
};