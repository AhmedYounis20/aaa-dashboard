import { useEffect, useState } from "react";
import {
  fetchAttachmentObjectUrl,
  isAttachmentContentUrl,
} from "@/shared/attachments/attachmentContent";

/** Turns a content URL into a blob URL. Data URIs and remote URLs pass through. */
export function useResolvedSrc(src: string | null | undefined): string {
  const [resolved, setResolved] = useState(() =>
    src && isAttachmentContentUrl(src) ? "" : (src ?? "")
  );

  useEffect(() => {
    if (!src || !isAttachmentContentUrl(src)) {
      setResolved(src ?? "");
      return;
    }

    setResolved("");
    let objectUrl: string | null = null;
    let cancelled = false;

    fetchAttachmentObjectUrl(src)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setResolved(url);
      })
      .catch(() => {
        if (!cancelled) setResolved("");
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return resolved;
}
