import React, { useEffect, useState } from 'react';
import {
  GroupProps,
} from '@react-three/fiber';
import { Color } from 'three';
import { useUnmountEffect } from '@react-hookz/web';
import { useA11y } from '@react-three/a11y';
import { CustomCursorState, useCustomCursor } from './CustomCursor';
import circlePoints from './lines/circle';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';

export const InvisibleInteractiveMesh = ({
  width = 1,
  height = 1,
  debug = false,
  cursor = 'normal',
  /** Must be idemponent */
  onFocus = () => {},
  /** Must be idemponent */
  onBlur = () => {},
  ...groupProps
}: {
  width?: number;
  height?: number;
  debug?: boolean;
  cursor?: CustomCursorState;
  /** Must be idemponent */
  onFocus?: () => void;
  /** Must be idemponent */
  onBlur?: () => void;
} & GroupProps) => {
  const setCursor = useCustomCursor()[1];

  const [hovering, setHovering] = useState(false);

  const { focus } = useA11y();

  // If hovering and the target cursor changes, call setCursor to change the cursor
  useEffect(() => {
    if (hovering) setCursor(cursor);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  // If the component unmounts, reset cursor and blue
  useUnmountEffect(() => {
    if (hovering) setCursor('normal');
    if (focus || hovering) onBlur();
  });

  // Fire on
  useEffect(() => {
    if (focus || hovering) onFocus();
    else onBlur();
  }, [focus, hovering, onBlur, onFocus]);

  return (
    <group
      {...groupProps}
    >
      <mesh
        renderOrder={1000}
        onPointerEnter={() => {
          setCursor(cursor);
          setHovering(true);
        }}
        onPointerLeave={() => {
          setCursor('normal');
          setHovering(false);
        }}
        onPointerOver={() => {
          setCursor(cursor);
          setHovering(true);
        }}
        position={[0, 0, 0]}
      >
        <boxGeometry
          attach="geometry"
          args={[width, height, 0.01]}
        />
        <meshStandardMaterial
          attach="material"
          color={new Color(0xff0000)}
          opacity={debug ? 0.3 : 0}
          transparent
          depthTest={false}
        />
      </mesh>

      <Scribble
        points={(circlePoints as CoordArray[])}
        size={Math.max(height, width) * 1.5}
        position={[0, 0, 0.1]}
        lineWidth={0.1}
        color={new Color(0xff0000)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={focus}
        curved
        nPointsInCurve={100}
        drawSpringConfig={{
          duration: 300,
        }}
      />
    </group>
  );
};
