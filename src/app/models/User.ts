export interface User {
    id: number
    reject: any
    email: string
    username: any
    firstName: string
    lastName: string
    enabled: boolean
    desactivated: boolean
    joiningData: any
    confirmationToken: any
    resetToken: any
    phoneCode: string
    lastLoginDate: string
    photo: any
    language: string
    profilePicture: any
    profilePictureAttachmentEntity: any
    candidateId: any
    parentUserId: any
    myReferralCode: any
    referredByCode: any
    referredByUserId: any
    assessmentReferralCode: any
    active: boolean
    phone: string
    modificationDate: any
    creationDate: string
    roles: Role[]
    actions: any[]
    messages: any[]
    company: any
}
  
export interface Role {
    id: number
    role: string
    description: string
}
  