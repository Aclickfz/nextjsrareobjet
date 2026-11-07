'use client';

import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { XIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { imgSrc } from '@/lib/utils';

const MAX_SCALE = 3;

export function ProductImageViewer({
  images,
  active,
  onChange,
  name
}: {
  images: { path: string }[];
  active: number;
  onChange: (index: number) => void;
  name: string;
}) {
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const src = imgSrc(images[active]?.path);

  function trackLens(event: MouseEvent<HTMLButtonElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1);
    setLens({ x, y });
  }

  function show(index: number) {
    onChange(index);
    setScale(1);
  }

  function step(event: KeyboardEvent<HTMLDivElement>) {
    if (images.length < 2) return;
    if (event.key === 'ArrowRight') show((active + 1) % images.length);
    if (event.key === 'ArrowLeft') show((active - 1 + images.length) % images.length);
  }

  return (
    <>
      <button
        type="button"
        className="pdp-zoom"
        aria-label={`Open ${name} image gallery`}
        onMouseMove={trackLens}
        onMouseLeave={() => setLens(null)}
        onClick={() => { setScale(1); setOpen(true); }}
      >
        <img src={src} className="img-fluid" alt={name} />
        {lens ? (
          <>
            <span className="pdp-zoom__lens" style={{ left: `${lens.x * 100}%`, top: `${lens.y * 100}%` }} aria-hidden="true" />
            <span
              className="pdp-zoom__pane"
              style={{ backgroundImage: `url("${src}")`, backgroundPosition: `${lens.x * 100}% ${lens.y * 100}%` }}
              aria-hidden="true"
            />
          </>
        ) : null}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="pdp-lightbox"
          overlayClassName="pdp-lightbox__overlay"
          showCloseButton={false}
          aria-describedby={undefined}
          onKeyDown={step}
        >
          <div className="pdp-lightbox__head">
            <DialogTitle className="pdp-lightbox__title">{name}</DialogTitle>
            <DialogClose className="pdp-lightbox__close" aria-label="Close gallery">
              <XIcon aria-hidden="true" />
            </DialogClose>
          </div>
          <div className="pdp-lightbox__body">
            <div className="pdp-lightbox__thumbs">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.path + index}
                  className={index === active ? 'is-active' : ''}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={index === active}
                  onClick={() => show(index)}
                >
                  <img src={imgSrc(image.path)} alt="" />
                </button>
              ))}
            </div>
            <div className="pdp-lightbox__stage">
              <img
                src={src}
                alt={`${name} view ${active + 1}`}
                style={scale > 1 ? { width: `${scale * 100}%`, maxWidth: 'none', maxHeight: 'none' } : undefined}
              />
            </div>
            <div className="pdp-lightbox__tools">
              <button type="button" aria-label="Zoom in" disabled={scale >= MAX_SCALE} onClick={() => setScale((value) => Math.min(MAX_SCALE, value + 0.5))}>
                <ZoomIn aria-hidden="true" />
              </button>
              <button type="button" aria-label="Zoom out" disabled={scale <= 1} onClick={() => setScale((value) => Math.max(1, value - 0.5))}>
                <ZoomOut aria-hidden="true" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
