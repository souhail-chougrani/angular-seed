// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ScrollTopService } from '../../../utilities.pck/accessories.mod/services/scroll-top.service';

@Component({
	selector: 'app-scroll-top',
	templateUrl: './scroll-top.component.html',
	styleUrls: ['./scroll-top.component.scss']
})

export class ScrollTopComponent implements OnInit, OnDestroy {
	public showScroll = false;
	public scrollDuration = 300;

	private unSubscribe: Subject<void> = new Subject<void>();

	constructor(private _scrollService: ScrollTopService) {
	}

	ngOnInit() {
		this._scrollService.scrollEvent
			.pipe(takeUntil(this.unSubscribe))
			.subscribe((status) => {
				this.showScroll = status === true;
			});
	}

	/**
	 * move to top of the page
	 */
	public onClickScrollToTop() {
		const scrollStep = -window.scrollY / (this.scrollDuration / 15),
			scrollInterval = setInterval(() => {
				if (window.scrollY !== 0) {
					window.scrollBy(0, scrollStep);
				} else {
					clearInterval(scrollInterval);
				}
			}, 15);
	}

	ngOnDestroy() {
		// remove subscriptions
		this.unSubscribe.next();
		this.unSubscribe.complete();
	}
}
