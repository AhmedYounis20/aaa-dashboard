import { apiClient } from "@/shared/api/apiClient";
import AttachmentModel from "@/interfaces/BaseModels/AttachmentModel";

/** Axios base URL already ends with `/api/`, so a `/api/attachments/...` path must be trimmed. */
export function toApiRelativePath(contentUrl: string): string {
  return contentUrl.replace(/^\/api\//, "");
}

export function isAttachmentContentUrl(src: string): boolean {
  return src.startsWith("/api/attachments/") || src.startsWith("attachments/");
}

export async function fetchAttachmentObjectUrl(contentUrl: string): Promise<string> {
  const response = await apiClient.get(toApiRelativePath(contentUrl), { responseType: "blob" });
  return URL.createObjectURL(response.data);
}

/** Local pick uses a data URI. A saved file uses the content URL the API returned. */
export function attachmentPreviewSrc(attachment?: AttachmentModel | null): string {
  if (!attachment) return "";
  if (attachment.fileContent && attachment.contentType) {
    return `data:${attachment.contentType};base64,${attachment.fileContent}`;
  }
  return attachment.contentUrl ?? "";
}
