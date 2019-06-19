// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../../enums/client-view-type.enum';
import { ClientService } from '../../../services/client.service';
import { ClientViewInterface } from '../../../interfaces/client-view.interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';

@Component({
	selector: 'app-client-default',
	templateUrl: './client-default.component.html',
	styleUrls: ['./client-default.component.scss']
})

export class ClientDefaultComponent implements OnInit, OnDestroy {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public currentUserRole: UserRoleEnum;
	public userRoleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public userRoleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];
	public overrideState = false;
	public clientGroupHotelsList;
	public tableApiUrl;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _clientService: ClientService,
		private _utilityService: UtilityService
	) {
	}

	ngOnInit() {
		// set current user role
		this.currentUserRole = this._clientService.appState && this._clientService.appState.role;

		// set table api
		this.tableApiUrl = this._clientService.clientTablesServices.hotelsByGroup;

		// listen: get client hotels
		this._clientService.clientDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.hotelGroupList) {
					// set override state
					this.overrideState = res.hgaOverride && res.hgaOverride.HotelManagerOverride;

					// set table data
					this.clientGroupHotelsList = res.hotelGroupList;

					// set country name
					this.clientGroupHotelsList.data = res.hotelGroupList.data.map(hotel => {
						return {
							...hotel,
							Country: this._utilityService.countryList.filter(
								country => country.id === hotel.Country
							)[0].text
						};
					});
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * show client form
	 *
	 * @param id
	 */
	public onClickFetchId(id?: string) {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.FORM,
			id: id
		};
		this.changeClientView.emit(payload);
	}
}
