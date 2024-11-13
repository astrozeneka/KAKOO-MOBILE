import { UploadedFile } from "../models/File";


export default function prepareFileFormData(fileData: UploadedFile, key='file'): FormData|null {
    
    let formData = new FormData();
    try{
      const byteCharacters = atob(fileData.base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], fileData.name, { type: fileData.type });
      formData.append('file', file);
    }catch(error){
      console.log("Cannot fetch data from the file, user hasn't uploaded file probably")
      formData = null as any
    }

    return formData
}