type StateType = 'fulfilled' | 'rejected';

type Result<F = any, R = any> = [F, never, StateType] | [never, R, StateType];

const awaitWrap = async <T extends Promise<any>>(p: T): Promise<Result<Awaited<T>>> => {
  let fulfilled: Awaited<T> | undefined;
  let rejected: any;
  let state: StateType;
  try {
    fulfilled = await p;
    state = 'fulfilled';
  } catch (error) {
    rejected = error;
    state = 'rejected';
  }
  return [fulfilled, rejected, state];
};

export default awaitWrap;
