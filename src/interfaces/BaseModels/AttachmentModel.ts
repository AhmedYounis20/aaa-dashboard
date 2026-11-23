interface AttachmentModel {
  attachmentId?: string | null;
  fileName: string;
  fileContent?: string;
  contentType: string;
  contentUrl?: string | null;
}

export default AttachmentModel;
