export enum AttachmentType {
  Picture = 1,
  License = 2,
  Manual = 3,
  Certificate = 4,
  Warranty = 5,
  Other = 6
}

export const AttachmentTypeOptions = [
  { value: AttachmentType.Picture, label: "Picture" },
  { value: AttachmentType.License, label: "License" },
  { value: AttachmentType.Manual, label: "Manual" },
  { value: AttachmentType.Certificate, label: "Certificate" },
  { value: AttachmentType.Warranty, label: "Warranty" },
  { value: AttachmentType.Other, label: "Other" }
];
