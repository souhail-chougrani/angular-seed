// angular
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// app
import { DialogInterface } from '../interfaces/dialog.interface';
import { DialogComponent } from '../components/dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
	constructor(private _dialog: MatDialog) {
	}

	/**
	 * show dialog
	 *
	 * @param data
	 */
	public showDialog(data: DialogInterface) {
		const dialogRef = this._dialog.open(DialogComponent, {
			disableClose: true,
			panelClass: 'app-mat-wrapper',
			width: '500px',
			data: data
		});

		return dialogRef.afterClosed();
	}
}
