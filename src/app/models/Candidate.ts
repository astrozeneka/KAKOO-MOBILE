export interface Candidate {
    candidateId: any
    userId: any
    profile: string
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
    id: number
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
  

  // The job
  export interface Job {
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
    regionList: any[]
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
    jobRequirementEntities: any[]
    jobQualificationEntities: any
    jobAdditionalSkillsEntities: any
    jobKeyResponsibilityEntities: any[]
    jobCustomQuestionEntities: any[]
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