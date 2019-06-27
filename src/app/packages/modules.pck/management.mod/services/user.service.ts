// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { UserInterface } from '../interfaces/user.interface';
import { UserRoleEnum } from '../../authorization.mod/enums/user-role.enum';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';

@Injectable()
export class UserService {
	public currentUser;
	public appState;
	public userTablesServices;
	public userDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _dialogService: DialogService
	) {
	}

	/**
	 * fetch new/existing users
	 *
	 * @param id
	 * @param userListType
	 */
	public userFetchList(id: string, userListType: string) {
		const allApi = AppServices['Management']['User_Default_List'];
		const hotelGroupApi = AppServices['Management']['User_Default_List_Hotel_Group'];
		const hotelApi = AppServices['Management']['User_Default_List_Hotel'];
		const queryParamsPayload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit,
			state: userListType
		};

		// validate app state
		if (this.appState || !id) {
			let payload = {};
			let api;
			switch (this.appState.type) {
				case AppStateEnum.ALL:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: allApi };

					// set api
					api = allApi;

					// set payload
					payload = {
						queryParams: queryParamsPayload
					};
					break;
				case AppStateEnum.GROUP:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: hotelGroupApi };

					// set api
					api = hotelGroupApi;

					// set payload
					payload = {
						pathParams: {
							groupId: this.appState && this.appState.groupId
						},
						queryParams: queryParamsPayload
					};
					break;
				case AppStateEnum.HOTEL:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: hotelApi };

					// set api
					api = hotelApi;

					// set payload
					payload = {
						pathParams: {
							groupId: this.appState && this.appState.groupId,
							hotelId: this.appState && this.appState.hotelId
						},
						queryParams: queryParamsPayload
					};
					break;
			}

			// service
			return this._proxyService
				.getAPI(api, payload)
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}

	/**
	 * remove user
	 *
	 * @param type
	 * @param row
	 */
	public userRemove(type: number, row: any) {
		// payload
		let payload: any = {
			bodyParams: {
				email: row.Email
			}
		};
		let api;
		switch (this.appState.type) {
			case AppStateEnum.ALL:
				// set api
				api = AppServices['Management']['User_Default_List_Remove_User'];
				break;
			case AppStateEnum.GROUP:
				// set api
				api = AppServices['Management']['User_Default_List_Remove_User_Group'];

				// set payload
				payload = {
					...payload,
					pathParams: {
						groupId: this.appState && this.appState.groupId
					}
				};
				break;
			case AppStateEnum.HOTEL:
				// set api
				api = AppServices['Management']['User_Default_List_Remove_User_Hotel'];

				payload = {
					...payload,
					pathParams: {
						groupId: this.appState && this.appState.groupId,
						hotelId: this.appState && this.appState.hotelId
					}
				};
				break;
		}

		// service
		this._proxyService.postAPI(api, payload).subscribe();
	}

	/**
	 * create new user
	 *
	 * @param formPayload
	 * @param dialogRef
	 */
	public userCreate(formPayload: UserInterface, dialogRef: any) {
		const role = this.appState.role;
		let api;
		let payload;
		switch (role) {
			case UserRoleEnum[UserRoleEnum.ADMIN]:
				// set api
				api = AppServices['Management']['User_Form_Create_User'];

				// set payload
				payload = {
					bodyParams: formPayload
				};
				break;
			case UserRoleEnum[UserRoleEnum.GROUP_MANAGER]:
				// set api
				api = AppServices['Management']['User_Form_Create_User_Group'];

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId
					}
				};
				break;
			case UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]:
				// set api
				api = AppServices['Management']['User_Form_Create_User_Hotel'];

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId,
						hotelId: this.appState && this.appState.hotelId
					}
				};
				break;
		}

		// service
		this._proxyService.postAPI(api, payload)
			.subscribe(() => {
				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: New User Created', id: 'Management_User_Form_NewUserCreated_Success_Title' }),
						message: this._i18n({
							value: 'Description: New User Created',
							id: 'Management_User_Form_NewUserCreated_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => dialogRef.close(true));
			});
	}

	/**
	 * create new user
	 *
	 * @param formPayload
	 * @param dialogRef
	 */
	public userUpdate(formPayload: UserInterface, dialogRef: any) {
		const role = this.appState.role;
		let api;
		let payload;
		switch (role) {
			case UserRoleEnum[UserRoleEnum.ADMIN]:
				// set api
				api = AppServices['Management']['User_Form_Update_User'];

				// set payload
				payload = {
					bodyParams: formPayload
				};
				break;
			case UserRoleEnum[UserRoleEnum.GROUP_MANAGER]:
				// set api
				api = AppServices['Management']['User_Form_Update_User_Group'];

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId
					}
				};
				break;
			case UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]:
				// set api
				api = AppServices['Management']['User_Form_Update_User_Hotel'];

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId,
						hotelId: this.appState && this.appState.hotelId
					}
				};
				break;
		}

		// service
		this._proxyService.postAPI(api, payload)
			.subscribe(() => {
				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: User Updated', id: 'Management_UserUpdated_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: User Updated',
							id: 'Management_UserUpdated_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => dialogRef.close(true));
			});
	}
}
