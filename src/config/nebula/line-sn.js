/* eslint-disable no-unused-vars */
import {
  useElement,
  useState,
  useStaleLayout,
  useRect,
  useEffect,
} from '@nebula.js/stardust';
import picassojs from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

import { easeSinIn as ease } from 'd3-ease';
import { timer } from 'd3-timer';
import { interpolate } from 'd3-interpolate';

// Define transition & stopTransition function
let transition = null;
const stopTransition = () => {
  if (transition) {
    transition.stop();
    transition = null;
  }
};

export default function supernova() {
  const picasso = picassojs();
  picasso.use(picassoQ);

  return {
    qae: {
      properties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{ qWidth: 2, qHeight: 5000 }],
          qSuppressZero: false,
          qSuppressMissing: true,
        },
        showTitles: true,
        title: '',
        subtitle: '',
        footnote: '',
      },
      data: {
        targets: [
          {
            path: '/qHyperCubeDef',
            dimensions: {
              min: 1,
              max: 1,
            },
            measures: {
              min: 1,
              max: 1,
            },
          },
        ],
      },
    },
    component() {
      const element = useElement();
      const layout = useStaleLayout();
      const rect = useRect();

      const [instance, setInstance] = useState();

      useEffect(() => {
        const p = picasso.chart({
          element,
          data: [],
          settings: {},
        });

        setInstance(p);

        return () => {
          p.destroy();
        };
      }, []);

      useEffect(() => {
        if (!instance) {
          return;
        }

        // reset transition
        if (transition) {
          stopTransition();
        }

        // Set duration
        const duration = 5000;

        // Run timer
        transition = timer((elapsed) => {
          // Set t
          const t = Math.min(1, ease(elapsed / duration));

          instance.update({
            data: [
              {
                type: 'q',
                key: 'qHyperCube',
                data: layout.qHyperCube,
              },
            ],
            settings: {
              scales: {
                x: {
                  data: {
                    extract: {
                      field: 'qDimensionInfo/0',
                    },
                  },
                },
                y: {
                  data: { field: 'qMeasureInfo/0' },
                  invert: true,
                  expand: 0.1,
                },
              },
              components: [
                {
                  type: 'axis',
                  dock: 'left',
                  scale: 'y',
                },
                {
                  type: 'axis',
                  dock: 'bottom',
                  scale: 'x',
                  settings: {
                    line: {
                      show: true,
                    },
                  },
                },
                {
                  type: 'grid-line',
                  x: {
                    scale: 'x',
                  },
                  ticks: {
                    show: true,
                    stroke: '#70707010',
                    strokeWidth: 2,
                    strokeDasharray: '3, 3',
                  },
                },
                {
                  key: 'lines',
                  type: 'line',
                  data: {
                    extract: {
                      field: 'qDimensionInfo/0',
                      props: {
                        y: { field: 'qMeasureInfo/0' },
                      },
                    },
                  },
                  settings: {
                    coordinates: {
                      major: {
                        scale: 'x',
                        fn: (d) => {
                          const { items } = d.data;
                          const start = Math.max(0, d.datum.value - 1);
                          const end = d.datum.value;
                          const time = Math.min(1, (t - d.datum.value / items.length) * items.length);

                          return time < 0 ? null : interpolate(d.resources.scale('x')(start), d.resources.scale('x')(end))(time);
                        },
                      },
                      minor: {
                        scale: 'y',
                        fn: (d) => {
                          const { items } = d.data;
                          const start = items.find((item) => item.value === Math.max(0, d.datum.value - 1)).y.value;
                          const end = items.find((item) => item.value === d.datum.value).y.value;
                          const time = Math.min(1, (t - d.datum.value / items.length) * items.length);

                          return time < 0 ? null : interpolate(d.resources.scale('y')(start), d.resources.scale('y')(end))(time);
                        },
                      },
                    },
                  },
                },
              ],
            },
          });

          if (t === 1) {
            stopTransition();
          }
        });
      }, [layout, instance]);

      useEffect(() => {
        if (!instance) {
          return;
        }
        instance.update();
      }, [rect.width, rect.height, instance]);
    },
  };
}
