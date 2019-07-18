// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { GuestTypeEnum } from '../enums/guest-type.enum';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';

@Injectable()
export class GuestOfferService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _dialogService: DialogService,
	) {
	}

	/**
	 * fetch active hotel offers
	 *
	 * @param id
	 */
	public guestHotelOffersFetch(id: number) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Guest']['Guest_Offers_And_Notifications_List_Hotel'];

		// payload
		const payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				offset: 0,
				limit: AppOptions.tablePageSizeWithoutLimit,
				type: GuestTypeEnum.OFFER,
				column: 'CreateDate',
				sort: 'desc'
			}
		};

		// set table resources
		this.tableServices = {
			api: api,
			payload: payload,
			uniqueID: 'ID',
			sortDefaultColumn: 'CreateDate'
		};

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}

	/**
	 * delete guest offer
	 *
	 * @param row
	 * @param refreshEmitter
	 */
	public guestRemoveOffer(row: any, refreshEmitter: any) {
		// dialog payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				title: this._i18n({ value: 'Title: Delete Guest Offer', id: 'Guest_Offer_Delete_Title' }),
				message: this._i18n({ value: 'Description: Delete Guest Offer', id: 'Guest_Offer_Delete_Description' }),
				icon: 'dialog_confirmation',
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					}),
				]
			}
		};

		// listen: dialog service
		this._dialogService
			.showDialog(data)
			.subscribe(res => {
				if (res) {
					// payload
					const payload: any = {
						pathParams: {
							groupId: this.appState.groupId,
							hotelId: this.appState.hotelId
						},
						bodyParams: {
							ID: row.ID
						}
					};

					// service
					this._proxyService
						.postAPI(AppServices['Guest']['Guest_Offers_And_Notifications_Remove_Hotel'], payload)
						.pipe(delay(1000))
						.subscribe(() => refreshEmitter.emit());
				}
			});
	}
}
