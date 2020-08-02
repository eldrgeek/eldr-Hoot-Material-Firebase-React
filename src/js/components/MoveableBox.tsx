import React from 'react';
import Moveable from 'react-moveable';

const MovableBox = ({ pos, Contents }) => {
  const [renderMovable, settRenderMovable] = React.useState(false);

  React.useEffect(() => {
    settRenderMovable(true);
  }, []);
  const moveRef = React.useRef(null);
  const [style, setStyle] = React.useState({
    position: 'absolute',
    // left: `${left}px`,
    // top: `${top}px`,
    background: 'lightgreen',
    border: '2px solid black',
    left: `${120 * pos}px`,
    height: '100px',
    width: '100px',
    color: 'blue',
  });
  // const handleDrag = e => {
  //   setStyle(e.transform);
  // };
  const onResizeStart = ({ target, clientX, clientY }) => {
    console.log('onResizeStart', target);
  };
  const onResize = ({
    target,
    width,
    height,
    dist,
    delta,
    direction,
    clientX,
    clientY,
  }) => {
    console.log('onResize', target);

    setStyle({
      position: 'absolute',
      // left: `${left}px`,
      // top: `${top}px`,
      background: 'lightgreen',
      border: '2px solid black',
      color: 'blue',
    });
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;

    // delta[0] && (target.style.width = `${width}px`);
    // delta[1] && (target.style.height = `${height}px`);
  };
  const onResizeEnd = ({ target, isDrag, clientX, clientY }) => {
    console.log('onResizeEnd', target, isDrag);
  };
  const onDragStart = ({ target, clientX, clientY }) => {
    console.log('onDragStart', target);
  };
  const onDrag = ({
    target,
    beforeDelta,
    beforeDist,
    left,
    top,
    right,
    bottom,
    delta,
    dist,
    transform,
    clientX,
    clientY,
  }) => {
    // console.log("onDrag left, top", left, top, target);
    setStyle({
      position: 'absolute',
      // left: `${left}px`,
      // top: `${top}px`,
      top: `${top}px`,
      left: `${left}px`,
      height: target.style.height,
      width: target.style.width,

      background: 'lightgreen',
      border: '2px solid black',
      color: 'green',
    });
    // target.style.left = `${left}px`;
    // target.style.top = `${top}px`;
    // console.log("onDrag translate", dist);
    // target.style.transform = transform;
  };
  const onDragEnd = ({ target, isDrag, clientX, clientY }) => {
    // console.log("onDragEnd", target, isDrag);
  };

  return (
    <div>
      {renderMovable ? (
        <Moveable
          // edge={false}
          //  ref={moveRef}
          resizable={false}
          // rendeDirections={["n", "nw", "ne", "s", "se", "sw", "e", "w"]}
          pinchable={['resizable', 'rotatable']}
          resizeable={true}
          target={moveRef && moveRef.current}
          draggable={true}
          origin={false}
          throttleDrag={0}
          onDrag={onDrag}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onResizeStart={onResizeStart}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      ) : (
        'FOO'
      )}
      <div ref={moveRef} style={style}>
        <Contents />
      </div>
      {/* <MovableComponent moveRef={moveRef} setStyle={setStyle} /> */}
    </div>
  );
};

export default MovableBox;
