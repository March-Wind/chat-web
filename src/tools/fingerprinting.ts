import FingerprintJS, { Agent, LoadOptions, murmurX64Hash128, transformSource } from '@fingerprintjs/fingerprintjs';
import type { GetResult, BuiltinComponents } from '@fingerprintjs/fingerprintjs';
import awaitWrap from '@/tools/await-wrap';

const fingerprintFn = async (): Promise<GetResult> => {
  const fpPromise = FingerprintJS.load({
    monitoring: false,
  });
  const [fp, err] = await awaitWrap(fpPromise);
  if (err) {
    return err;
  }

  const [result, err2] = await awaitWrap(fp.get());
  if (err2) {
    return err2;
  }
  return result;
  // const string = FingerprintJS.componentsToDebugString(result.components)
  // return string;
  // fpPromise.then((fp: Agent) => {
  //   // The FingerprintJS agent is ready.
  //   // Get a visitor identifier when you'd like to.
  //   fp.get().then((result) => {
  //     // This is the visitor identifier:
  //     const visitorId = result.visitorId;
  //     console.log(result.components);
  //     // debugger
  //     console.log(FingerprintJS.hashComponents(result.components))
  //     console.log(visitorId);
  //     console.log(FingerprintJS.componentsToDebugString(result.components));
  //     // debugger
  //   });
  // }).catch((err: any) => {
  //   console.error(err);
  // });
};

export default fingerprintFn;
