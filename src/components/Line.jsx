import React, { useRef, useEffect } from 'react';
import useNebula from 'hooks/useNebula';

const Intro = () => {
  const nebula = useNebula();
  const elementRef = useRef();
  const chartRef = useRef();

  useEffect(async () => {
    if (!nebula) return;

    chartRef.current = await nebula.render({
      element: elementRef.current,
      type: 'line',
      fields: [
        '[ActivationMonth]',
        '=Sum([Revenue])',
      ],
    });
  }, [nebula]);

  return (
    <div className="section">
      <div>
        <div
          id="lineViz"
          ref={elementRef}
          style={{ height: 600, width: 1000 }}
        />
      </div>
    </div>
  );
};

export default Intro;
