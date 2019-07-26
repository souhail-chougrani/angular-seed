// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as moment from 'moment';
import * as ErrorHandlerActions from '../../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { faPauseCircle, faPlayCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestViewInterface } from '../../../interfaces/guest-view.interface';
import { PushMessageService } from '../../../services/push-message.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { GuestPushMessageInterface } from '../../../interfaces/guest-push-message.interface';
import { GuestTypeEnum } from '../../../enums/guest-type.enum';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { SelectGroupInterface } from '../../../../../core.pck/fields.mod/interfaces/select-group.interface';
import { ErrorHandlerInterface } from '../../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';

@Component({
	selector: 'app-guest-push-message-form',
	templateUrl: './guest-push-message-form.component.html',
	styleUrls: ['./guest-push-message-form.component.scss']
})

export class GuestPushMessageFormComponent implements OnInit, OnDestroy {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public faIcons = [faSpinner, faPlayCircle, faPauseCircle];
	public formFields;
	public systemLanguages;
	public systemInfo;
	public tabsList = [];
	public minDate = moment().toDate();
	public title = 'Form';

	public staticColors = ['#3e9d2e', '#d2a41a', '#e74c3c'];
	public dateTimeButton = false;
	public isAccess = false;
	public isState = false;

	public guestPeriodsList: SelectDefaultInterface[] = [];
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public selectTypeGroup = SelectTypeEnum.GROUP;
	public hotelList: SelectDefaultInterface[] = [];
	public hotelListGroup: SelectGroupInterface[] = [];
	public selectedHotels = [];
	public targetGroupsList: SelectDefaultInterface[] = [];

	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public roleGroupManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.GROUP_MANAGER];
	public roleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];
	public roleHotelSubManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_SUB_MANAGER];
	public permissionLevel2 = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _pushMessageService: PushMessageService,
		private _utilityService: UtilityService,
		private _helperService: HelperService,
		private _formBuilder: FormBuilder,
		private _store: Store<{ ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _i18n: I18n
	) {
		// get periods list
		this.guestPeriodsList = this._utilityService.getGuestPeriods();
		this.guestPeriodsList.shift();

		// target groups list
		this.targetGroupsList = this._utilityService.getTargetGroups();

		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// form group
		this.formFields = new FormGroup({
			languages: this._formBuilder.array([]),
			state: new FormControl(false),
			link: new FormControl('', [ValidationService.urlValidator]),
			color: new FormControl(this.staticColors[0]),
			oneTime: new FormGroup({
				date: new FormControl(''),
				time: new FormControl('', [ValidationService.timeValidator])
			}),
			periodicTime: new FormGroup({
				date: new FormControl(''),
				time: new FormControl('', [ValidationService.timeValidator])
			}),
			periodically: new FormControl(''),
			hotels: new FormControl('', [Validators.required]),
			targetGroups: new FormControl('', [Validators.required]),
			access: new FormControl(false)
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._pushMessageService.appState.role;
		if (this.currentRole) {
			this.permissionLevel2 = this._helperService.permissionLevel2(this.currentRole);
		}

		// listen: fetch form languages
		this._pushMessageService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// form languages
				if (res && res.formLanguages) {
					// reset tab list
					this.tabsList = [];

					// tabs list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach((language, index) => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add tabs
							this.tabsList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);

							// title, text
							const title = this.formFields.controls['languages'].controls[index].controls['title'];
							const text = this.formFields.controls['languages'].controls[index].controls['description'];

							// update existing data
							if (this.data) {
								title.setValue(this.data.Titles[language]);
								this.title = this.data.Titles[language];
								text.setValue(this.data.Text[language]);
							}

							// listen: title field
							title.valueChanges
								.pipe(takeUntil(this._ngUnSubscribe))
								.subscribe(x => this.title = x);
						});
					}

					// update existing data
					if (this.data) {
						// link, color
						this.link.setValue(this.data.Data.Link);
						this.color.setValue(this.data.Data.Colour);

						// access, state
						this.isAccess = this.data.Access.toLowerCase() !== 'group';
						this.access.setValue(this.isAccess);
						this.isState = this.data.State.toLowerCase() === 'active';
						this.state.setValue(this.isState);

						// target groups and period
						const selectedGroups = this.targetGroupsList.filter(target => target.id === this.data['Target Group']);
						const selectedPeriod = this.guestPeriodsList.filter(target => target.id === this.data['Trigger']);

						if (selectedGroups.length) {
							this.targetGroups.setValue(...selectedGroups);
						} else {
							this.targetGroups.setValue(this.targetGroupsList[0]);
						}

						if (selectedPeriod.length) {
							this.periodically.setValue(...selectedPeriod);
						} else {
							this.periodically.setValue(this.guestPeriodsList[0]);
						}

						// trigger
						if (this.data.Trigger.toLowerCase() === 'adhoc') {
							this.periodically.disable();
							this.oneTime.controls['time'].enable();
							this.periodicTime.controls['time'].disable();
							this.dateTimeButton = true;
						} else {
							this.periodically.enable();
							this.oneTime.controls['time'].disable();
							this.periodicTime.controls['time'].enable();
							this.dateTimeButton = false;
						}

						// send date
						if (this.data.SendDate) {
							const date = moment(this.data.SendDate).toDate();
							const time = moment(this.data.SendDate).format('HH:mm');
							if (!moment(this.data.SendDate).isBefore(moment())) {
								this.oneTime.controls['date'].setValue(date);
								this.oneTime.controls['time'].setValue(time);
							}

							// set validators
							this.setSendDateValidators();
						}

						// expire date
						if (this.data.ExpDate) {
							const date = moment(this.data.ExpDate).toDate();
							const time = moment(this.data.ExpDate).format('HH:mm');
							if (!moment(this.data.ExpDate).isBefore(moment())) {
								this.periodicTime.controls['date'].setValue(date);
								this.periodicTime.controls['time'].setValue(time);
							}

							// set validators
							this.setExpDateValidators();
						}
					} else {
						// send date
						this.onClickSetDateTimeNow();

						// set first value
						this.periodically.setValue(this.guestPeriodsList[0]);

						// set validation
						this.setExpDateValidators();
					}
				}
			});

		// listen: on hotels change
		this.hotels.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					const hotels = res.map(hotel => hotel.id.split('_')[0]);
					const uniqueSet = new Set(hotels);
					const hotelsList = [...uniqueSet];
					if (hotelsList.length > 1) {
						// set previous values
						this.hotels.setValue(this.selectedHotels);

						// payload
						payload = {
							icon: 'error_icon',
							title: this._i18n({
								value: 'Title: Wrong Group Selection Error Exception',
								id: 'Error_Common_GroupSelection_Title'
							}),
							message: this._i18n({
								value: 'Description: Wrong Group Selection Error Exception',
								id: 'Error_Common_GroupSelection_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
					} else {
						this.selectedHotels = this.hotels.value;
					}
				}
			});

		let payload;
		switch (this.currentRole) {
			case this.roleAdmin:
				// hotel list
				this.getAllGroupHotels();
				break;
			case this.roleGroupManager:
				// payload
				payload = {
					pathParams: { groupId: this._pushMessageService.appState.groupId }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
			case this.roleHotelManager:
			case this.roleHotelSubManager:
				// payload
				const hotelIds = this._pushMessageService.currentUser.profile['custom:hotelId'].split(',');
				payload = {
					pathParams: { groupId: this._pushMessageService.appState.groupId },
					queryParams: { 'HotelIDs[]': hotelIds }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
		}
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get formArray() {
		return <FormArray>this.formFields.controls.languages.controls;
	}

	get state() {
		return this.formFields.get('state');
	}

	get link() {
		return this.formFields.get('link');
	}

	get color() {
		return this.formFields.get('color');
	}

	get targetGroups() {
		return this.formFields.get('targetGroups');
	}

	get periodically() {
		return this.formFields.get('periodically');
	}

	get access() {
		return this.formFields.get('access');
	}

	get hotels() {
		return this.formFields.get('hotels');
	}

	get oneTime() {
		return this.formFields.get('oneTime');
	}

	get periodicTime() {
		return this.formFields.get('periodicTime');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * add forms groups for each language
	 */
	public addLanguageSpecificFields() {
		(<FormArray>this.formFields.controls['languages']).push(
			new FormGroup({
				title: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(64)
				]),
				description: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(2000)
				])
			})
		);
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		const formData = this.formFields.getRawValue();

		// title & description
		const title = {};
		const description = {};
		if (this.tabsList && this.tabsList.length) {
			for (let i = 0; i < this.tabsList.length; i++) {
				title[this.tabsList[i].id] = formData.languages[i].title;
				description[this.tabsList[i].id] = formData.languages[i].description;
			}
		}

		// date and time
		const trigger = (this.dateTimeButton) ? 'ADHOC' : this.periodically.value.id;
		let sendDate = null;
		let expDate = null;
		if (this.dateTimeButton) {
			sendDate = GuestPushMessageFormComponent.prepareUTCFromDateTime(this.oneTime.controls['date'], this.oneTime.controls['time']);
		} else {
			expDate = GuestPushMessageFormComponent.prepareUTCFromDateTime(this.periodicTime.controls['date'], this.periodicTime.controls['time']);
		}

		// state, access
		const state = (this.state.value) ? 'ACTIVE' : 'INACTIVE';
		const access = (this.access.value) ? 'HOTEL' : 'GROUP';

		// id
		const id = (!!this.data) ? {ID: this.data.ID} : {};

		// form
		const formPayload: GuestPushMessageInterface = {
			...id,
			Type: GuestTypeEnum.NOTIFICATION,
			State: state,
			Title: title,
			Text: description,
			Link: this.link.value,
			Colour: this.color.value,
			Trigger: trigger,
			SendDate: sendDate,
			ExpDate: expDate,
			Targets: [this.targetGroups.value.id],
			HotelID: this.hotels.value.map(hotel => hotel.id),
			Access: access
		};

		// service
		this._pushMessageService.guestUpdatePushMessage(formPayload, !!this.data, this.changePushMessageView);
	}

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: GuestViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changePushMessageView.emit(payload);
	}

	/**
	 * on tab change
	 *
	 * @param tabEvent
	 */
	public onChangeTab(tabEvent: any) {
		const titleValue = this.formArray[tabEvent.index].controls['title'].value;
		this.title = titleValue ? titleValue : 'Form';
	}

	/**
	 * on change date time and periodically
	 *
	 * @param radioEvent
	 */
	public onChangeDateTimeAndPeriodically(radioEvent: any) {
		if (radioEvent.value === 'date') {
			// set fields
			this.oneTime.controls['date'].enable();
			this.oneTime.controls['time'].enable();
			this.periodicTime.controls['date'].disable();
			this.periodicTime.controls['time'].disable();
			this.periodically.disable();
			this.dateTimeButton = true;

			// set validators
			this.setSendDateValidators();

			// clear validators
			this.periodicTime.controls['date'].clearValidators();
			this.periodicTime.controls['time'].clearValidators();
		}

		if (radioEvent.value === 'periodic') {
			// set fields
			this.oneTime.controls['date'].disable();
			this.oneTime.controls['time'].disable();
			this.periodicTime.controls['date'].enable();
			this.periodicTime.controls['time'].enable();
			this.periodically.enable();
			this.dateTimeButton = false;

			// set validators
			this.setExpDateValidators();

			// clear validators
			this.oneTime.controls['date'].clearValidators();
			this.oneTime.controls['time'].clearValidators();
		}
	}

	/**
	 * set current date and time
	 */
	public onClickSetDateTimeNow() {
		this.oneTime.controls['date'].setValue(moment().toDate());
		this.oneTime.controls['time'].setValue(moment().format('HH:mm'));
	}

	/**
	 * toggle state
	 */
	public onClickToggleState() {
		this.isState = !this.isState;
		this.state.setValue(this.isState);
	}

	/**
	 * prepare utc from date and time
	 */
	private static prepareUTCFromDateTime(date: any, time: any) {
		const dateStr = date.value,
			timeStr = time.value,
			d = moment(dateStr),
			t = moment(timeStr, 'HH:mm');

		d.set({
			hour: t.get('hour'),
			minute: t.get('minute'),
			second: t.get('second')
		});

		// utc format
		return d.utc().format();
	}

	/**
	 * set send date validators
	 */
	private setSendDateValidators() {
		this.oneTime.controls['date'].setValidators([Validators.required]);
		this.oneTime.controls['time'].setValidators([Validators.required]);
		this.oneTime.controls['date'].updateValueAndValidity();
		this.oneTime.controls['time'].updateValueAndValidity();
	}

	/**
	 * set expiry date validators
	 */
	private setExpDateValidators() {
		this.periodicTime.controls['date'].setValidators([Validators.required]);
		this.periodicTime.controls['time'].setValidators([Validators.required]);
		this.periodicTime.controls['date'].updateValueAndValidity();
		this.periodicTime.controls['time'].updateValueAndValidity();
	}

	/**
	 * get particular group hotels
	 *
	 * @param payload
	 */
	public getGroupHotels(payload: any) {
		this._utilityService
			.getHotelListByGroup(payload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(result => {
				// set hotel list
				this.hotelList = result.items.map(hotel => {
					return {
						id: hotel.HotelID,
						text: hotel.Name
					};
				});

				// pre-select hotels
				if (this.data && this.data.HotelIDs) {
					const hotelIds = this.data.HotelIDs;
					const hotels = this.hotelList.filter(hotel =>
						typeof hotelIds !== 'string' ? hotelIds.includes(hotel.id) : hotel.id === hotelIds
					);
					this.hotels.setValue(hotels);
				}
			});
	}

	/**
	 * get all group hotels
	 */
	public getAllGroupHotels() {
		this._utilityService
			.getAllGroupHotels()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// map response
				const mapped = res.items
					.filter(hotel => hotel.hasOwnProperty('HotelID'))
					.reduce((acc, hotel) => {
						if (!acc.hasOwnProperty(hotel.GroupID)) {
							acc[hotel.GroupID] = [];
						}
						acc[hotel.GroupID].push({
							id: hotel.HotelID,
							text: hotel.Name
						});
						return acc;
					}, {});

				// convert object to array
				// @ts-ignore
				this.hotelListGroup = Object.entries(mapped).map(hotel => {
					return {
						name: hotel[0],
						items: hotel[1]
					};
				});

				// pre-select hotels
				if (this.data && this.data.HotelIDs) {
					const hotelIds = this.data.HotelIDs;
					const groupId = typeof hotelIds !== 'string' ? hotelIds[0].split('_')[0] : hotelIds.split('_')[0];
					let selectedItems = [];
					for (let i = 0; i < this.hotelListGroup.length; i++) {
						if (this.hotelListGroup[i].name === groupId) {
							selectedItems = this.hotelListGroup[i].items.filter(hotel =>
								typeof hotelIds !== 'string' ? hotelIds.includes(hotel.id) : hotel.id === hotelIds
							);
						}
					}
					this.hotels.setValue(selectedItems);
				}
			});
	}
}