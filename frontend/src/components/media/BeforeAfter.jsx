import { useEffect, useId, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { MoveHorizontal } from 'lucide-react';
import Photo from './Photo';
import { ease } from '../../utils/motion';

// Drag-to-compare: the "after" photo sits underneath, the "before" photo is clipped from the left.
// Drag anywhere on the photo, use the handle, or (keyboard) focus it and use the arrow keys.
// The first time it scrolls into view, the divider glides across to reveal the result.
//   <BeforeAfter before={photo('ba1-before')} after={photo('ba1-after')} />
export default function BeforeAfter({ before, after, sizes = '(min-width: 1024px) 40vw, 100vw', className = '', intro = true, priority = false }) {
  const id = useId();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [pos, setPos] = useState(intro && !reduce ? 92 : 50);
  const dragging = useRef(false);

  useEffect(() => {
    if (!intro || reduce || !inView) return undefined;
    const controls = animate(92, 50, { duration: 4, ease, onUpdate: (v) => !dragging.current && setPos(v) });
    return () => controls.stop();
  }, [inView, intro, reduce]);

  const fromPointer = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className={`group/ba frame relative isolate cursor-ew-resize touch-pan-y overflow-hidden select-none ${className}`}
      style={{ aspectRatio: `${after.width} / ${after.height}`, backgroundColor: after.tone }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e);
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Photo image={after} sizes={sizes} priority={priority} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Photo image={before} sizes={sizes} priority={priority} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <span className="label pointer-events-none absolute top-4 left-4 rounded-full bg-cherry/70 px-3 py-1.5 text-ivory backdrop-blur-sm">Before</span>
      <span className="label pointer-events-none absolute top-4 right-4 rounded-full bg-ivory/80 px-3 py-1.5 text-cherry backdrop-blur-sm">After</span>

      {/* Divider and handle */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-ivory/90" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-cherry/55 text-ivory backdrop-blur-md transition-transform duration-700 group-hover/ba:scale-110">
          <MoveHorizontal className="size-5" strokeWidth={1.25} />
        </span>
      </div>

      {/* Keyboard and screen-reader control */}
      <label htmlFor={id} className="sr-only">
        Compare before and after: {after.alt}
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        onFocus={() => (dragging.current = true)}
        className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        style={{ pointerEvents: 'none' }}
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-blush ring-inset opacity-0 peer-focus-visible:opacity-100" aria-hidden="true" />
    </div>
  );
}
