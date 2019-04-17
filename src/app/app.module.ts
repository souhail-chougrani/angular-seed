// angular
import { NgModule } from '@angular/core';
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

// app
import { AppComponent } from './app.component';
import { FrameModule } from './packages/frame.pck/frame.module';
import { APP_ROUTES } from './app-routing';
import { LoadingAnimationModule } from './packages/utilities.pck/loading-animation.mod/loading-animation.module';
import { FieldsModule } from './packages/core.pck/fields.mod/fields.module';
import { StorageModule } from './packages/core.pck/storage.mod/storage.module';
import { ProxyModule } from './packages/core.pck/proxy.mod/proxy.module';
import { DialogModule } from './packages/utilities.pck/dialog.mod/dialog.module';
import { ErrorHandlerModule } from './packages/utilities.pck/error-handler.mod/error-handler.module';
import { HttpInterceptorProviders } from './packages/core.pck/proxy.mod/http-interceptor';
import { MaterialModule } from './packages/vendors.pck/material.mod/material.module';
import { NotificationModule } from './packages/utilities.pck/notification.mod/notification.module';
import { AuthorizationModule } from './packages/modules.pck/authorization.mod/authorization.module';
import { AppLayoutComponent } from './app-layout.component';

@NgModule({
	imports: [
		// angular
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(APP_ROUTES),

		// store
		StoreModule.forRoot({
			loadingAnimation: loadingAnimationReducer,
			notification: notificationReducer,
			errorHandler: errorHandlerReducer,
		}),
		StoreDevtoolsModule.instrument({ maxAge: 10 }),

		// core
		ProxyModule,
		StorageModule,
		FieldsModule,

		// utilities
		NotificationModule,
		LoadingAnimationModule,
		DialogModule,
		ErrorHandlerModule,

		// vendors
		MaterialModule,

		// frame
		FrameModule,
		AuthorizationModule
	],
	declarations: [AppComponent, AppLayoutComponent],
	providers: [HttpInterceptorProviders],
	bootstrap: [AppComponent]
})

export class AppModule {
}