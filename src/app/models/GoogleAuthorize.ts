

export interface GoogleAuthorize {
    defaultCharset: string
    requestContextAttribute: any
    beanName: any
    applicationContext: any
    url: string
    statusCode: string
    contextRelative: boolean
    propagateQuery: boolean
    hosts: any
    redirectView: boolean
    supportedMediaTypes: SupportedMediaType[]
  }
  
  export interface SupportedMediaType {
    type: string
    subtype: string
    parameters: Parameters
    qualityValue: number
    wildcardType: boolean
    wildcardSubtype: boolean
    subtypeSuffix: any
    charset: string
    concrete: boolean
  }
  
  export interface Parameters {
    charset: string
  }
  