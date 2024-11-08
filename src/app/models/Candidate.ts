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
    resumeAttachmentEntity: any
    educationCertificateEntities: EducationCertificateEntity[]
    licenceCertificateEntities: any // ???
    workExperienceEntities: WorkExperienceEntity[]
    projectPortfolioEntities: ProjectPortfolioEntity[]
    socialAccountEntities: SocialAccountEntity[]
    skillListEntities: SkillEntity[]
    languageEntities: LanguageEntity[]
    candidateEducationEntities: CandidateEducationEntity[]
    candidateCertificateEntities: CandidateCertificateEntity[]
    selfCandidateMobilityEntities: any
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
    skillTypeEntity: any
  }
  
  export interface LanguageEntity {
    id: any
    name: string
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
  