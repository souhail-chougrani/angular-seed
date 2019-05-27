// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { MemberService } from '../../../services/member.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-profile-upload-image',
	templateUrl: './profile-upload-image.component.html',
	styleUrls: ['./profile-upload-image.component.scss']
})

export class ProfileUploadImageComponent implements OnInit, OnDestroy {
	public faIcons = [faSpinner];
	public fileFormats = ['image/jpeg', 'image/jpg', 'image/png'];
	public maxFileSize = 1024;
	public previewSrc;
	public errorMessage;
	public loading = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _memberService: MemberService,
		public dialogRef: MatDialogRef<ProfileUploadImageComponent>) {
	}

	ngOnInit() {
		// listen: on new image upload
		this._memberService.profileImageUpdate
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.loading = false);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this.dialogRef.close();
	}

	/**
	 * listener: drop over
	 *
	 * @param $event
	 */
	public onDragOver($event) {
		$event.stopPropagation();
		$event.preventDefault();
	}

	/**
	 * listener: runs when file drops on the drop area
	 *
	 * @param $event
	 */
	public onDrop($event) {
		$event.stopPropagation();
		event.preventDefault();

		const transfer = $event.dataTransfer;
		const file = transfer.files[0];

		// set file
		this.setFilePreview(file);
	}

	/**
	 * selected file
	 *
	 * @param file
	 */
	public setFilePreview(file) {
		if (file) {
			const fileType = file.type;
			const fileSize = file.size / 1000;

			// validate file-format
			if (this.fileFormats.includes(fileType)) {
				// validate file-size
				if (fileSize <= this.maxFileSize) {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => {
						this.previewSrc = reader.result;
						this.errorMessage = null;
					};
				} else {
					this.previewSrc = null;
					this.errorMessage = 'File-size is greater than 1MB!';
				}
			} else {
				this.previewSrc = null;
				this.errorMessage = 'Wrong file format!';
			}
		}
	}

	/**
	 * upload image to the database
	 */
	public onClickSaveImage() {
		// show spinner and lock button
		this.loading = true;

		// service
		this._memberService.memberChangeImage(this.previewSrc, this.dialogRef);
	}
}
