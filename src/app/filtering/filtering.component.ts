import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription, BehaviorSubject, from, fromEvent, of } from 'rxjs';
import { filter, skipWhile, take, distinctUntilKeyChanged, debounceTime, pluck, distinctUntilChanged, switchMap, map, takeLast, distinct } from 'rxjs/operators';
import { data, IData, Gender } from '../data.model';

@Component({
  selector: 'app-filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.less'],
})
export class FilteringComponent implements OnInit {
  dataStream$: Observable<IData> = from(data);
  streamFromInput$ = new BehaviorSubject<string | undefined>('');
  sub: Subscription | undefined;
  inputSub: Subscription | undefined;

  constructor() { }

  @ViewChild('textField', { static: true })
  textField: ElementRef<HTMLInputElement> | undefined;

  ngOnInit(): void {
    this.textField?.nativeElement.addEventListener('input', this.onInputChanged.bind(this));

    /* Enter search string in the input field and wait 2 seconds. After that data which lastName
    contains this string should be displayed in console.
    */
    this.inputSub = this.streamFromInput$.pipe(
      debounceTime(2000), // <-- period of silence
      switchMap(value => {
        if (value) {
          return this.dataStream$.pipe(
            filter(item => item.lastName.toLocaleLowerCase().includes(value)),
          );
        } else {
          return of(null);
        }
      }),
    ).subscribe(value => {
      if (value) {
        console.log(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.inputSub?.unsubscribe();
  }

  /* Filter given data to find all "Male" people living in China. Display in console
  their firstName, lastName and emai.
  */
  onFilterClick(): void {
    console.log('filter works!!!');
    this.sub = this.dataStream$.pipe(
      filter(value => value.gender === Gender.Male && value.country === "China"),
    ).subscribe(value => console.log(`${value.firstName} ${value.lastName} ${value.email}`));
  }

  /* Skip given data until "id" is less then 20 and take only 10 people. Display in console
  their id, firstName and lastName.
  */
  onSkipWhileAndTakeClick(): void {
    console.log('skipWhile and take work!!!');
    this.sub = this.dataStream$.pipe(
      skipWhile(value => value.id < 20),
      take(10),
    ).subscribe(value => console.log(`${value.id} ${value.firstName} ${value.lastName}`));
  }

  /* Display alternating list of mans and womans from the given data.
  Show in console their id, firstName, lastName and gender.
  */
  onDistinctUntilKeyChangedClick(): void {
    console.log('distinctUntilKeyChanged works!!!');
    this.sub = this.dataStream$.pipe(
      distinctUntilKeyChanged('gender'),
    ).subscribe(value => console.log(`${value.id} ${value.firstName} ${value.lastName} ${value.gender}`));
  }

  onInputChanged(): void {
    this.streamFromInput$.next(this.textField?.nativeElement.value);
  }
}
