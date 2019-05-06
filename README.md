# Angular CLI
Angular CLI based seed application incorporating many best practices typically needed in Enterprise apps. It includes:
- [X] HttpClient: `getAPI`, `postAPI`
	- Ensure secure HTTPs calls
	- HTTP Caching
	- HTTP Error Handling
- [X] Angular Routing
- [X] Custom Pipes: `firstKey`
- [X] Web Storage API: `local`, `session`, `memory`
- [X] Components from Material: `input`, `select`, `dialog`, `tree`, `sidenav`
- [X] Icons from Material and Fontawesome

![Alt text](preview.png?raw=true "Angular Seed")


## Content
Please follow the link for the documentation: [GUIDE](./GUIDE.md)

#### Configuration
- [X] SCSS Inclusion
- [X] Linting: `scss, ts`
- [X] Build Environments: `dev, stag, next, prod`

#### Development
- [X] Loading Animation
- [X] Notification: `success`, `error`, `info`, `warning`
- [X] Dialog: `confirmation`
- [X] Error Handler: `common`, `system`
- [X] Storage: `local`, `session`, `memory`
- [X] Proxy: `getAPI`, `postAPI`


## Libraries and Frameworks

#### Internal
- [X] [SCSS Framework](https://github.com/imransilvake/SCSS-Framework)

#### External 
- [X] [Angular CLI](https://cli.angular.io/)
- [X] [Redux](https://github.com/angular-redux/store)
- [X] [Redux Devtools](https://github.com/ngrx/store-devtools)
- [X] [Angular Material](https://material.angular.io/)
- [X] [Moment](https://momentjs.com/)
- [X] [HammerJS](https://hammerjs.github.io/)
- [X] [Fontawesome](https://fontawesome.com/)
- [X] [Password Strength (zxcvbn)](https://github.com/dropbox/zxcvbn)
- [X] [JWT Decode](https://github.com/auth0/jwt-decode)
- [X] [CryptoJS](https://github.com/brix/crypto-js)


## Environments
|Serve|Script|Description|
|---|---|---|
|Development|`yarn start`|Serve the application @ `localhost:1500`|
|Next|`yarn serve.app.next`|Serve the application @ `localhost:2000`|
|Staging|`yarn serve.app.stag`|Serve the application @ `localhost:3000`|
|Production|`yarn serve.app.prod`|Serve the application @ `localhost:4000`|
|Production@en|`yarn serve.app.prod-en`|Serve the application @ `localhost:4001/en` directory|
|Production@de|`yarn serve.app.prod-de`|Serve the application @ `localhost:4002/de` directory|

|Build|Script|Description|
|---|---|---|
|Development|`yarn build`|Build the application to `./dist` directory|
|Next|`yarn build.app.next`|Build the application to `./dist` directory|
|Staging|`yarn build.app.stag`|Build the application to `./dist` directory|
|Production|`yarn build.app.prod`|Build the application to `./dist` directory|
|Production@en|`yarn build.app.prod-en`|Build the application to `./dist/app-en/` directory|
|Production@de|`yarn build.app.prod-de`|Build the application to `./dist/app-de/` directory|

## Translation
|Script|Description|
|---|---|
|`yarn translate`|Fetch translation content from *.html files|
|`yarn translate:ts`|Fetch translation content from *.ts files|

## Linting
|Script|Description|
|---|---|
|`yarn lint:ts`|Lint Typescript|
|`yarn lint:scss`|Lint SCSS|


## SCSS
Include this import in each component to get access to [SCSS variables and functions](https://github.com/imransilvake/SCSS-Framework/blob/master/documentation/guide.md).
```
@import 'main';
```
