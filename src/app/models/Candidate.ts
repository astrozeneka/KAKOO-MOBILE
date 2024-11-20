import { BehaviorSubject, Observable } from "rxjs"
import { User } from "./User"

export interface Candidate {
    candidateId: any
    userId: any
    profile: string // This is job title
    firstName: string
    middleName: any
    lastName: string
    aboutContent: string
    dob: any
    email: string
    phoneNumber: string
    phoneCode: string
    address: any
    resumeUrl: any
    selfIntroductionVideoUrl: any
    profilePicture: string
    preferenceLocation: any
    isProfileCompleted: boolean
    totalExperience: number
    resumeData: string
    dailyRate: any
    employmentTypeEntity: any
    preferredJobRolesEntity: any
    hiringStatusEntity: any
    noticePeriodEntity: any
    workTypeEntity: any
    salaryExpectationEntity: any
    hobbiesEntities: any
    interestListEntities: any
    countryEntity: CountryEntity
    stateEntity: StateEntity
    cityEntity: CityEntity
    resumeAttachmentEntity: ResumeAttachmentEntity,
    educationCertificateEntities: EducationCertificateEntity[]
    licenceCertificateEntities: any // ???
    workExperienceEntities: WorkExperienceEntity[]
    projectPortfolioEntities: ProjectPortfolioEntity[]
    socialAccountEntities: SocialAccountEntity[]
    skillListEntities: SkillEntity[]
    languageEntities: LanguageEntity[]
    candidateEducationEntities: CandidateEducationEntity[]
    candidateCertificateEntities: CandidateCertificateEntity[]
    selfCandidateMobilityEntities: MobilityEntity[]
    profileCompleted: boolean
  }
  
  export interface CountryEntity {
    countryId: number
    name: any
  }

  export interface RegionEntity extends CountryEntity{
    iso2: string
  }
  
  export interface StateEntity {
    stateId: number
    name: any
    countryId: number
  }
  
  export interface CityEntity {
    cityId: number
    name: any
    stateId: number
  }
  
  export interface EducationCertificateEntity {
    id: any
    college: string
    location: string
    startDate: string
    endDate: string
    degreeEntity: DegreeEntity
    educationLevelEntity: any
  }
  
  export interface DegreeEntity {
    id: any
    name: string
    abbreviation: any
  }
  
  export interface WorkExperienceEntity {
    id: any
    jobTitle: string
    companyName: string
    description: string
    startDate: string
    endDate?: string
    responsibilitiesAndAchievements: any
    employmentType: any
    location?: string
    workType: any
  }
  
  export interface ProjectPortfolioEntity {
    id: any
    projectTitle: any
    projectDescription: any
    projectURL: string
    startDate: any
    endDate: any
    skillListEntities: SkillEntity[]
  }
  
  export interface SocialAccountEntity {
    id: any
    name: string
    profileUrl: string
  }
  
  export interface SkillEntity {
    id: any
    name: string
    skillTypeEntity: SkillTypeEntity
  }

  export interface SkillTypeEntity {
    id: any
    name: string
  }
  
  export interface LanguageEntity {
    id: any
    name: string
    nameFr?: string
  }
  
  export interface CandidateEducationEntity {
    id: any
    degreeName: string
    college: string
    year: string
  }

  export interface CandidateCertificateEntity { // Experimental
    name: string,
    institution: string,
    year: string,

    // V1 properties
    expireDate: string
    id: any
    issueDate: string
    issuingOrganization: string
    licenceId: string
    licenceURL: string
    title: string
  }

  export interface MobilityEntity {
    id: number
    name: string
    nameFr: string
  }
  
  export interface ResumeAttachmentEntity {
    attachmentId: number
    name: string
    fullPath: any
    fileUUTD: string
    createdBy: number
    fileType: string
    createdAt: string
    storageCloudType: string
  }

  export interface PaginedEntities<T> {
    content: T[]
    pageNumber: number
    pageSize: number
    totalElement: number
    totalPages: number
    lastPage: boolean
  }

  /**
   * @deprecated Use PaginedEntities<JobInvitationEntity> instead
   */
  export interface PaginedJobInvitationArray {
    content: JobInvitationEntity[]
    pageNumber: number
    pageSize: number
    totalElement: number
    totalPages: number
    lastPage: boolean
  }
  
  export interface JobInvitationEntity {
    id: number
    jobEntity: JobEntity
    candidateIdHr: number
    coverLater: any
    inviteStatus: string
    candidateJobStatus: string
    sendToClintStatus: any
    attachmentEntities: any[]
    candidateNote?: string
    createdById: number
    createdBy: User // ???? Not sure yet
    updatedBy: number
    companyId?: number
    createdAt: string
    updatedAt: string
    jobAppliedAnswer: any
  }
  // The job
  export interface JobEntity {
    jobId: number
    jobIdToDisplay: any
    positionTitle: string
    title: any
    description: any
    onOfPosition: any
    language: any
    isOtherProfile: any
    totalExperience: number
    postalCode: any
    certificationsLicensesIsRequired: boolean
    skillListEntities: SkillEntity[]
    regionList: RegionEntity[] // Similar to Country (but not the same)
    stateEntities: any[]
    cityEntities: CityEntity[]
    jobAdditionalDetails: JobAdditionalDetail[]
    workTypeEntity: WorkTypeEntity
    employmentTypeEntity: EmploymentTypeEntity
    minimumQualification: any
    certificateName: any
    salaryRangeSalaryExpectationEntity: SalaryRangeSalaryExpectationEntity
    jobPriority: string
    jobStatus: string
    createdBy: number
    updatedBy: number
    createdByUserDetail: any
    client: any
    companyId: number
    isInternal: any
    clientId: any
    recruitmentQuota: any
    isFromAi: any
    totalInvited: any
    totalApplied: any
    totalInterview: any
    createdAt: string
    updatedAt: string
    cultureFitQuestionEntities: any[]
    prescreeningQuestionEntities: any[]
    jobRequirementEntities: JobRequirementEntity[]
    jobQualificationEntities: any
    jobAdditionalSkillsEntities: any
    jobKeyResponsibilityEntities: JobKeyResponsibilityEntity[]
    jobCustomQuestionEntities: JobCustomQuestionEntity[]
    jobQualificationHTML: any
    jobDescriptionHTML: any
    otherSkills: any[]
    spokenLanguageEntities: any[]
    qualifiedCount: any
    interviewedCount: any
    financialNegotiationCount: any
    sentToClintCount: any
    hiredCount: any
    allStatusCounts: any
    isPostedOnMonster: boolean
    industryCode: any
    basePayAmountMin: any
    basePayAmountMax: any
    userAreaDuration: any
    userAreapartTimeDuration: any
    userAreadisplayedPay: any
    userAreaStatusJob: any
    userAreajobType: any
    travelArea: any
    expectedStartDate: any
    companyName: any
    apecJobPostStatus: any
    apecJobPostedAt: any
  }

  export interface JobAdditionalDetail {
    jobAdditionalDetailId: number
    name: string
    details: string
  }

  export interface WorkTypeEntity {
    id: number
    name: string
    name_fr: string
  }

  export interface EmploymentTypeEntity {
    id: number
    name: string
    name_fr: string
  }

  export interface SalaryRangeSalaryExpectationEntity {
    id: number
    from_amount: number
    to_amount: number
    currency: string
  }

  export interface MeetingEntity {
    id: number
    jobId: number
    candidateId: number
    candidateEmailId: string
    thirdPartyEmail: string
    description: string
    title: any
    schedulerEmailId: string
    interviewerEmailId: string
    timeZone: any
    interviewStatus: string
    meetingLink: string
    fromTime: string
    toTime: string
    jobEntity: JobEntity
  }
  
  export interface JobCustomQuestionEntity {
    jobCustomQuestionId: number
    name: string
    isMandatory: boolean
  }
  
  export interface JobKeyResponsibilityEntity {
    id: number,
    name: string
  }

  export interface JobRequirementEntity {
    id: number,
    name: string
  }

  export interface CompanyEntity {
  id: number
  tagline: any
  yearOfFounded: any
  introduction: string
  financialInformation: string
  linkedInUrl: any
  twitterUrl: any
  facebookUrl: any
  instagramUrl: string
  status: string
  reject: any
  phoneCode: string
  profilePictureAttachmentEntity: ProfilePictureAttachmentEntity
  companyKeyAchievementsEntities: any[]
  companyProductServiceEntities: any[]
  companyAddressEntities: any[]
  photo: string
  subscription: Subscription
  countryEntity: any
  salesPersonEntity: SalesPersonEntity
  type: string
  name: string
  address: string
  email: any
  phone: string
  currency: string
  employeeMinSalary: number
  modificationDate: string
  creationDate: string
  userAreajobType: any
  userAreaDuration: any
  industryCode: any
  userAreapartTimeDuration: any
  userAreadisplayedPay: any
  userAreaStatusJob: any
  basePayAmountMin: any
  basePayAmountMax: any
  travelArea: any
}

export interface ProfilePictureAttachmentEntity {
  attachmentId: number
  name: string
  fullPath: any
  fileUUTD: string
  createdBy: number
  fileType: string
  createdAt: string
  storageCloudType: string
}

export interface Subscription {
  id: number
  paid: boolean
  rhnumber: number
  startSubscription: string
  expitationPeriod: number
  amount: number
  psp: Psp[]
  planId: number
  transactionType: string
  chargeId: string
  freeTrailAvailed: boolean
}

export interface Psp {
  id: number
  type: string
  amount: string
  currency: string
  customerId: string
}

export interface SalesPersonEntity {
  selesPersonId: number
  name: string
  description: any
}

export interface CandidateAssessmentEntity {
  candidateAssessmentId: number
  title: string
  totalQuestion: number
  attendQuestion: number
  passedQuestion: number
  assessmentId: number
  companyId: number
  candidateId: number
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
  assessmentStatus: string
  expirationTime: string
  candidateAssessmentAnswerEntities: CandidateAssessmentAnswerEntity[]
  createdByUserDetail: CreatedByUserDetail
  auserId: any
}

export interface CandidateAssessmentAnswerEntity {
  candidateAssessmentAnswerId: number
  assessmentQuestionId: number
  question: string
  correctAnswer: string
  candidateAnswer?: string
  isPassed: boolean
  isSkip: boolean
  candidateAssessmentId: number
  userCode: any
  codeCompiledOutput: any
}

export interface CreatedByUserDetail {
  id: number
  firstName: string
  lastName: string
  companyName: string
}

/**
 * Experimental feature used to keep track of components
 * */
export interface Displayable { // Unused for now
  subject?: BehaviorSubject<JobInvitationEntity>
  $?: Observable<JobInvitationEntity>
}