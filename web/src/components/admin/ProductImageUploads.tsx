'use client';

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, X } from 'lucide-react';
import { AdminButton, AdminFieldError, useAdminForm } from '@/components/admin/AdminForm';
import { ProductGalleryImage } from '@/components/admin/ProductGalleryImage';

type SavedImage = { id: number; path: string; is_primary: number; sort_order?: number };
type PendingFile = { id: string; file: File; preview: string };

function toPending(files: FileList | File[]): PendingFile[] {
  return Array.from(files).map((file, index) => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    file,
    preview: URL.createObjectURL(file)
  }));
}

function syncInput(input: HTMLInputElement | null, files: File[]) {
  if (!input) return;
  const transfer = new DataTransfer();
  for (const file of files) transfer.items.add(file);
  input.files = transfer.files;
}

export function ProductImageUploads({
  productId,
  images = [],
  isEdit
}: {
  productId?: number;
  images?: SavedImage[];
  isEdit: boolean;
}) {
  const { fieldErrors, pending } = useAdminForm();
  const mainId = useId();
  const galleryId = useId();
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [mainName, setMainName] = useState('');
  const [pendingGallery, setPendingGallery] = useState<PendingFile[]>([]);
  const mainPreviewRef = useRef<string | null>(null);
  const pendingGalleryRef = useRef<PendingFile[]>([]);

  const savedGallery = images
    .filter((image) => !image.is_primary)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id);
  const primary = images.find((image) => image.is_primary);

  mainPreviewRef.current = mainPreview;
  pendingGalleryRef.current = pendingGallery;

  useEffect(() => () => {
    if (mainPreviewRef.current) URL.revokeObjectURL(mainPreviewRef.current);
    for (const item of pendingGalleryRef.current) URL.revokeObjectURL(item.preview);
  }, []);

  function onMainChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (mainPreview) URL.revokeObjectURL(mainPreview);
    if (!file) {
      setMainPreview(null);
      setMainName('');
      return;
    }
    setMainPreview(URL.createObjectURL(file));
    setMainName(file.name);
  }

  function setGalleryFiles(next: PendingFile[]) {
    setPendingGallery((current) => {
      const keep = new Set(next.map((item) => item.id));
      for (const item of current) if (!keep.has(item.id)) URL.revokeObjectURL(item.preview);
      return next;
    });
    syncInput(galleryInputRef.current, next.map((item) => item.file));
  }

  function onGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    const added = toPending(files);
    const next = [...pendingGallery, ...added];
    // Keep ordered FileList on the named input for submit; clear value first so the same files can be re-picked.
    event.target.value = '';
    setGalleryFiles(next);
  }

  function movePending(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= pendingGallery.length) return;
    const next = [...pendingGallery];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setGalleryFiles(next);
  }

  return (
    <section className="admin-image-uploads" aria-label="Product images">
      <h3 className="admin-section-title">Images</h3>
      <p className="admin-help">Gallery images keep the order shown below (1, 2, 3…). Reorder before saving.</p>

      {(primary || savedGallery.length > 0) && productId ? (
        <div className="admin-saved-gallery">
          <div className="admin-saved-gallery-label">Current images</div>
          <div className="product-gallery-grid">
            {primary ? (
              <div className="product-gallery-wrap">
                <span className="product-gallery-order">Main</span>
                <ProductGalleryImage image={primary} productId={productId} />
              </div>
            ) : null}
            {savedGallery.map((image, index) => (
              <div key={image.id} className="product-gallery-wrap">
                <span className="product-gallery-order">{index + 1}</span>
                <ProductGalleryImage image={image} productId={productId} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="form-grid admin-upload-grid">
        <div className="admin-file-field">
          <div className="admin-file-field-head">
            <label htmlFor={mainId}>{isEdit ? 'Replace main image' : 'Main image'}</label>
            {mainName ? <span className="admin-file-name">{mainName}</span> : <span className="admin-file-name muted">No file chosen</span>}
          </div>
          <input
            ref={mainInputRef}
            id={mainId}
            data-slot="input"
            className="admin-file-input"
            type="file"
            name="image"
            accept="image/*"
            disabled={pending}
            onChange={onMainChange}
            aria-invalid={Boolean(fieldErrors.image)}
            aria-describedby={fieldErrors.image ? `${mainId}-error` : undefined}
          />
          <AdminFieldError name="image" id={`${mainId}-error`} />
          {mainPreview ? (
            <div className="admin-main-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainPreview} alt="Selected main image preview" />
            </div>
          ) : null}
        </div>

        <div className="admin-file-field">
          <div className="admin-file-field-head">
            <label htmlFor={galleryId}>{isEdit ? 'Add gallery images' : 'Gallery images'}</label>
            <span className="admin-file-name muted">
              {pendingGallery.length ? `${pendingGallery.length} selected` : 'No file chosen'}
            </span>
          </div>
          <input
            ref={galleryInputRef}
            id={galleryId}
            data-slot="input"
            className="admin-file-input"
            type="file"
            name="gallery"
            accept="image/*"
            multiple
            disabled={pending}
            onChange={onGalleryChange}
            aria-invalid={Boolean(fieldErrors.gallery)}
            aria-describedby={fieldErrors.gallery ? `${galleryId}-error` : undefined}
          />
          <AdminFieldError name="gallery" id={`${galleryId}-error`} />
        </div>
      </div>

      {pendingGallery.length ? (
        <div className="admin-pending-gallery">
          <div className="admin-saved-gallery-label">Upload order (sort order)</div>
          <div className="admin-pending-gallery-list">
            {pendingGallery.map((item, index) => (
              <div key={item.id} className="admin-pending-gallery-item">
                <span className="product-gallery-order">{index + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.preview} alt={item.file.name} />
                <div className="admin-pending-gallery-meta">
                  <strong title={item.file.name}>{item.file.name}</strong>
                  <span>{Math.max(1, Math.round(item.file.size / 1024))} KB</span>
                </div>
                <div className="admin-pending-gallery-actions">
                  <AdminButton type="button" variant="outline" size="sm" aria-label={`Move ${item.file.name} up`} disabled={index === 0 || pending} onClick={() => movePending(index, -1)}>
                    <ArrowUp size={14} aria-hidden="true" />
                  </AdminButton>
                  <AdminButton type="button" variant="outline" size="sm" aria-label={`Move ${item.file.name} down`} disabled={index === pendingGallery.length - 1 || pending} onClick={() => movePending(index, 1)}>
                    <ArrowDown size={14} aria-hidden="true" />
                  </AdminButton>
                  <AdminButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${item.file.name}`}
                    disabled={pending}
                    onClick={() => setGalleryFiles(pendingGallery.filter((entry) => entry.id !== item.id))}
                  >
                    <X size={14} aria-hidden="true" />
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
          <div className="admin-form-actions compact">
            <AdminButton type="button" variant="outline" size="sm" disabled={pending} onClick={() => setGalleryFiles([])}>
              Clear selection
            </AdminButton>
            <AdminButton type="button" variant="outline" size="sm" disabled={pending} onClick={() => galleryInputRef.current?.click()}>
              <ImagePlus size={14} aria-hidden="true" />
              Add more
            </AdminButton>
          </div>
        </div>
      ) : null}
    </section>
  );
}
