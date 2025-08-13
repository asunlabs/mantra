type GeneratorSuccessType<T> = {
  data: T;
  error: null;
};
type GeneratorErrorType = {
  data: null;
  error: unknown;
};
type GeneratorYieldType<T> = GeneratorSuccessType<T> | GeneratorErrorType;
type GeneratorReturnType = void;
type GeneratorNextParameterType<R> = R;
export {
  GeneratorErrorType,
  GeneratorSuccessType,
  GeneratorYieldType,
  GeneratorReturnType,
  GeneratorNextParameterType,
};
