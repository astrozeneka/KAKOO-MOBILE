// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiEndpoint: 'https://f666bfa7-b6c4-4059-bd09-2823b447609e.mock.pstmn.io',
  apiEndpoint: 'https://web.kakoo-software.com/kakoo-back-end',
  serverHost: 'staging.kakoo-software.com',
  cachePrefix: 'kakoodev-',
  defaultLanguageSelection: 'prompt', // system, prompt

  mFormMode: 'email', // Only 'email' is available
  mFormOptions: [
    {
      label: 'Ryan +21',
      email: 'ryanrasoarahona3+21@gmail.com',
      password: 'ryanrasoarahona1'
    },
    {
      label: 'Antmank',
      email: 'antmank@yopmail.com',
      password: '123456'
    },
    {
      label: 'Supermank',
      email: 'supermank@yopmail.com',
      password: '123456'
    },
    {
      label: 'Ryan +22',
      email: 'ryanrasoarahona3+22@gmail.com',
      password: '123456'
    }
    /*{
      label: 'Ryan +3',
      email: 'ryanrasoarahona3+3@gmail.com',
      password: 'ryanrasoarahona1'
    },
    {
      label: 'Ryan +4',
      email: 'ryanrasoarahona3+4@gmail.com',
      password: 'ryanrasoarahona1'
    },
    {
      label: 'Ryan +10',
      email: 'ryanrasoarahona3+10@gmail.com',
      password: 'ryanrasoarahona1'
    }*/
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
