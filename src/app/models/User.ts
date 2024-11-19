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

export interface ReferralEntity {
    id: number
    candidateId: number
    candidateName: string
    candidateType: string
    profile: any
    profilePicture: any
    gender: any
    email: string
    mobilePhone: any
    phoneCode: any
    forCompanyId: any
    forCompanyName: any
    forJobTypeId: any
    forJobTypeName: any
    currentStatus: string
    createdAt: string
    updatedAt: string
    jobIdAndCandidateStatusDtoList: any[]
}