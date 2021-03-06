// angular
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

// app
import { SelectTypeEnum } from '../../enums/select-type.enum';
import { SelectDefaultInterface } from '../../interfaces/select-default-interface';
import { SelectGroupInterface } from '../../interfaces/select-group.interface';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss']
})

export class SelectComponent {
	@Input() selectType: SelectTypeEnum = SelectTypeEnum.DEFAULT;
	@Input() multipleSelection = false;

	@Input() control = new FormControl();
	@Input() dataDefault: SelectDefaultInterface[] = [];
	@Input() dataGroups: SelectGroupInterface[] = [];

	@Input() showLabel = false;
	@Input() labelName;

	@Input() selectId = 'app-select';
	@Input() selectClassPanel = 'app-select-panel';
	@Input() selectPlaceHolder;

	@Input() showHint = false;
	@Input() hintText;

	@Input() selectFocused = false;
}
