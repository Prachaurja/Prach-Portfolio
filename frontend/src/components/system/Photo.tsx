/* eslint-disable @next/next/no-img-element */
import type { ImageRef } from "@/lib/content";

/**
 * Renders an uploaded photo or a labelled placeholder frame. Photos are set
 * from the Dev Tool (stored as data-URLs), so empty slots stay graceful.
 */
export default function Photo({
  src,
  label = "Photo",
  className = "",
  rounded = "rounded-2xl",
}: {
  src?: ImageRef;
  label?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={`photo-frame ${rounded} ${className}`}>
      {src ? (
        <img src={src} alt={label} loading="lazy" />
      ) : (
        <div className="photo-empty h-full w-full">
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
