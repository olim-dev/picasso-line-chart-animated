import { embed } from '@nebula.js/stardust';
import qlikAppPromise from 'config/qlikApp';
import line from './line-sn';

export default new Promise((resolve) => {
  (async () => {
    const qlikApp = await qlikAppPromise;
    const nebula = embed(qlikApp, {
      types: [{
        name: 'line',
        load: () => Promise.resolve(line),
      }],
    });
    resolve(nebula);
  })();
});
