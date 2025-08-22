import { useState, useEffect, useRef, use } from 'react'

interface Pill {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  minSize: number;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;
}

function App() {
  const [pills, setPills] = useState<Pill[]>([]);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  const mainBody = useRef<HTMLDivElement>(null);
  const horizontalLine = useRef<HTMLDivElement>(null);
  const verticalLine = useRef<HTMLDivElement>(null); 
  const pillId = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    setDrawStart({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    let startX = drawStart.x;
    let startY = drawStart.y;
    let endX = e.clientX;
    let endY = e.clientY;

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    if (width < 40 || height < 40) return;

    const newPill: Pill = {
      id: pillId.current++,
      x,
      y,
      width,
      height,
      color: getRandomColor(),
      minSize: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20
    };

    setPills(prev => [...prev, newPill]);
  };

  const onMouseClick = (e: React.MouseEvent) => {
    if (isDrawing) return;
    
    const horizontalLineAxis = e.clientY;
    const verticalLineAxis = e.clientX;

    setPills(prev => {
      const babyPills: Pill[] = [];

      for (const pill of prev) {
        const withinX = verticalLineAxis > pill.x && verticalLineAxis < pill.x + pill.width;
        const withinY = horizontalLineAxis > pill.y && horizontalLineAxis < pill.y + pill.height;

        if (withinX && withinY) {
          const leftBabyPillWidth = verticalLineAxis - pill.x;
          const rightBabyPillWidth = pill.x + pill.width - verticalLineAxis;
          const topBabyPillHeight = horizontalLineAxis - pill.y;
          const bottomBabyPillHeight = pill.y + pill.height - horizontalLineAxis;
          
          if(leftBabyPillWidth >= pill.minSize && rightBabyPillWidth >= pill.minSize && topBabyPillHeight >= pill.minSize && bottomBabyPillHeight >= pill.minSize) {
            const topLeftBabyPill: Pill = { ...pill, id: pillId.current++, width: leftBabyPillWidth, height: topBabyPillHeight, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 };
            const topRightBabyPill: Pill = { ...pill, id: pillId.current++, x: verticalLineAxis, width: rightBabyPillWidth, height: topBabyPillHeight, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };
            const bottomLeftBabyPill: Pill = { ...pill, id: pillId.current++, y: horizontalLineAxis, height: bottomBabyPillHeight, width: leftBabyPillWidth, borderBottomRightRadius: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 };
            const bottomRightBabyPill: Pill = { ...pill, id: pillId.current++, x: verticalLineAxis, y: horizontalLineAxis, height: bottomBabyPillHeight, width: rightBabyPillWidth, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 0 };
            babyPills.push(topLeftBabyPill, topRightBabyPill, bottomLeftBabyPill, bottomRightBabyPill);
            continue;
          }
        }

        else if (withinX) {
          const leftBabyPillWidth = verticalLineAxis - pill.x;
          const rightBabyPillWidth = pill.x + pill.width - verticalLineAxis;
          if (leftBabyPillWidth >= pill.minSize && rightBabyPillWidth >= pill.minSize) {
            babyPills.push({ ...pill, id: pillId.current++, width: leftBabyPillWidth, borderTopRightRadius: 0, borderBottomRightRadius: 0 }, { ...pill, id: pillId.current++, x: verticalLineAxis, width: rightBabyPillWidth, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 });
            continue;
          }
        }

        else if (withinY) {
          const topBabyPillHeight = horizontalLineAxis - pill.y;
          const bottomBabyPillHeight = pill.y + pill.height - horizontalLineAxis;
          if (topBabyPillHeight >= pill.minSize && bottomBabyPillHeight >= pill.minSize) {
            babyPills.push({ ...pill, id: pillId.current++, height: topBabyPillHeight, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, { ...pill, id: pillId.current++, y: horizontalLineAxis, height: bottomBabyPillHeight, borderTopLeftRadius: 0, borderTopRightRadius: 0 });
            continue;
          }
        }
        babyPills.push(pill);
      }
      return babyPills
    });
  };

  const onDragStart = (e: React.DragEvent, id: number) => {
    const pill = pills.find(p => p.id === id);
    if (!pill) return;
    e.dataTransfer.setData('id', String(id));
    e.dataTransfer.setData('offsetX', String(e.clientX - pill.x));
    e.dataTransfer.setData('offsetY', String(e.clientY - pill.y));
  };

  const onDragStop = (e: React.DragEvent) => {
    const id = e.dataTransfer.getData('id');
    const offsetX = e.dataTransfer.getData('offsetX');
    const offsetY = e.dataTransfer.getData('offsetY');

    setPills(prev => {
      const pill = prev.find(p => p.id === Number(id));
      if (!pill) return prev;

      const newX = e.clientX - Number(offsetX);
      const newY = e.clientY - Number(offsetY);

      return prev.map(p => p.id === pill.id ? { ...p, x: newX, y: newY } : p);
    });
  };

  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#AED6F1', '#F1948A', '#D7BDE2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const output = mainBody.current;
    const hLine = horizontalLine.current;
    const vLine = verticalLine.current;
    if (!output || !hLine || !vLine) return;

    const onMouseMove = (e: MouseEvent) => {
      hLine.style.top = `${e.clientY}px`;
      vLine.style.left = `${e.clientX}px`;
    };

    output.addEventListener('mousemove', onMouseMove);
    return () => output.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div id="output" ref={mainBody} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onDragOver={e => e.preventDefault()} onDrop={onDragStop} onClick={onMouseClick} className="relative w-[100vw] h-[100vh] font-bold text-xl font-mono text-slate-600 overflow-hidden">
        <div id="horizontal-line" ref={horizontalLine} className="absolute left-0 right-0 h-0.5 bg-red-500 pointer-events-none z-10 opacity-60"></div>
        <div id="vertical-line" ref={verticalLine} className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10 opacity-60"></div>

        {pills.map(pill => (
          <div
            key={pill.id}
            data-type="pill"
            draggable
            onDragStart={e => onDragStart(e, pill.id)}
            className="absolute border border-black"
            style={{
              left: pill.x,
              top: pill.y,
              width: pill.width,
              height: pill.height,
              backgroundColor: pill.color,
              borderTopLeftRadius: `${pill.borderTopLeftRadius}px`,
              borderBottomLeftRadius: `${pill.borderBottomLeftRadius}px`,
              borderTopRightRadius: `${pill.borderTopRightRadius}px`,
              borderBottomRightRadius: `${pill.borderBottomRightRadius}px`,
            }}
          />
        ))}
      </div>
    </>
  )
}

export default App
