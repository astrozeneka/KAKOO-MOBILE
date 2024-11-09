import { ResumeAttachmentEntity } from "./Candidate"


export default interface IFile{
    name: string,
    type: string,
    permalink: string,
    base64: string
}

export interface UploadedFile extends IFile {
    createdAt: string
}

const convertAttachmentEntityToFile = (e:ResumeAttachmentEntity):UploadedFile=>{
    return {
        name: e.name,
        type: e.fileType,
        permalink: e.fullPath,
        createdAt: e.createdAt
    } as UploadedFile
}