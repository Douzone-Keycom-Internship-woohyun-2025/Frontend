import type { AddFavoritePayload } from "@/types/favorite";
import type { PatentListItem, PatentDetail } from "@/types/patent";

export function buildFavoritePayloadFromList(p: PatentListItem): AddFavoritePayload {
  return {
    applicationNumber: p.applicationNumber,
    inventionTitle: p.inventionTitle ?? "",
    applicantName: p.applicantName ?? "",
    abstract: null,
    applicationDate: p.applicationDate ?? "",
    openNumber: null,
    publicationNumber: null,
    publicationDate: null,
    registerNumber: null,
    registerDate: null,
    registerStatus: p.registerStatus ?? null,
    drawingUrl: null,
    ipcNumber: null,
    mainIpcCode: p.mainIpcCode ?? null,
  };
}

export function buildFavoritePayloadFromDetail(d: PatentDetail): AddFavoritePayload {
  return {
    applicationNumber: d.applicationNumber,
    inventionTitle: d.inventionTitle ?? "",
    applicantName: d.applicantName ?? "",
    abstract: d.astrtCont ?? null,
    applicationDate: d.applicationDate ?? "",
    openNumber: d.openNumber ?? null,
    publicationNumber: d.publicationNumber ?? null,
    publicationDate: d.publicationDate ?? null,
    registerNumber: d.registerNumber ?? null,
    registerDate: d.registerDate ?? null,
    registerStatus: d.registerStatus ?? null,
    drawingUrl: d.drawing || null,
    ipcNumber: d.ipcNumber ?? null,
    mainIpcCode: d.mainIpcCode ?? null,
  };
}
