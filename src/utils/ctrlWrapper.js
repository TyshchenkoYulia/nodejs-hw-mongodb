const ctrlWrapper = (controller) => {
  const func = async (reg, res, next) => {
    try {
      await controller(reg, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};
export default ctrlWrapper;
