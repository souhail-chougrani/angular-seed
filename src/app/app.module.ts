// angular
import { LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// store
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { loadingAnimationReducer } from './packages/utilities.pck/loading-animation.mod/store/reducers/loading-animation.reducer';
import { notificationReducer } from './packages/utilities.pck/notification.mod/store/reducers/notification.reducer';
import { errorHandlerReducer } from './packages/utilities.pck/error-handler.mod/store/reducers/error-handler.reducer';
import { sessionReducer } from './packages/core.pck/session.mod/store/reducers/session.reducer';

// app
import { AppComponent } from './app.component';
import { FrameModule } from './packages/frame.pck/frame.module';
import { APP_ROUTES } from './app-routing';
import { LoadingAnimationModule } from './packages/utilities.pck/loading-animation.mod/loading-animation.module';
import { FieldsModule } from './packages/core.pck/fields.mod/fields.module';
import { DialogModule } from './packages/utilities.pck/dialog.mod/dialog.module';
import { ErrorHandlerModule } from './packages/utilities.pck/error-handler.mod/error-handler.module';
import { HttpInterceptorProviders } from './packages/core.pck/proxy.mod/http-interceptor';
import { MaterialModule } from './packages/vendors.pck/material.mod/material.module';
import { NotificationModule } from './packages/utilities.pck/notification.mod/notification.module';
import { AuthorizationModule } from './packages/modules.pck/authorization.mod/authorization.module';
import { AppLayoutComponent } from './app-layout.component';
import { DashboardComponent } from './packages/modules.pck/dashboard.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';

// i18n using polyfills
// provided by webpack
declare const require;

@NgModule({
	imports: [
		// angular
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' }),

		// store
		StoreModule.forRoot({
			loadingAnimation: loadingAnimationReducer,
			notification: notificationReducer,
			errorHandler: errorHandlerReducer,
			session: sessionReducer
		}, {
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true,
				strictStateSerializability: true,
				strictActionSerializability: true
			}
		}),
		StoreDevtoolsModule.instrument({ maxAge: 10 }),

		// core
		FieldsModule,

		// utilities
		NotificationModule,
		LoadingAnimationModule,
		DialogModule,
		ErrorHandlerModule,

		// vendors
		MaterialModule,
		AmplifyAngularModule,

		// frame
		FrameModule,
		AuthorizationModule
	],
	declarations: [
		AppComponent,
		AppLayoutComponent,
		DashboardComponent
	],
	providers: [
		I18n,
		{
			provide: TRANSLATIONS,
			useFactory: (locale) => {
				locale = locale || 'de';
				return require(`raw-loader!../locale/translation.${ locale }.xlf`);
			},
			deps: [LOCALE_ID]
		},
		{ provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
		HttpInterceptorProviders,
		AmplifyService
	],
	bootstrap: [AppComponent]
})

export class AppModule {
}
