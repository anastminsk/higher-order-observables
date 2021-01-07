import { Component, OnDestroy } from '@angular/core';
import { Observable, of, from, Subscription } from 'rxjs';
import { delay, concatMap, mergeMap, switchMap, exhaustMap } from 'rxjs/operators';

interface IData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  country: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnDestroy {
  title = 'Higher Order Observables';

  data: IData[] = [
    {
      id: 1,
      firstName: 'Michele',
      lastName: 'Kellington',
      email: 'mkellington0@epa.gov',
      gender: 'female',
      country: 'China'
    },
    {
      id: 2,
      firstName: 'Tildie',
      lastName: 'Rushford',
      email: 'trushford1@prweb.com',
      gender: 'female',
      country: 'Netherlands'
    },
    {
      id: 3,
      firstName: 'Raddie',
      lastName: 'Kennifick',
      email: 'rkennifick2@mysql.com',
      gender: 'male',
      country: 'Portugal'
    },
    {
      id: 4,
      firstName: 'Lowell',
      lastName: 'Dan',
      email: 'ldan3@utexas.edu',
      gender: 'male',
      country: 'Greece'
    },
    {
      id: 5,
      firstName: 'Rosina',
      lastName: 'Childes',
      email: 'rchildes4@about.me',
      gender: 'female',
      country: 'Sweden'
    },
    {
      id: 6,
      firstName: 'Joela',
      lastName: 'Acom',
      email: 'jacom5@themeforest.net',
      gender: 'female',
      country: 'Argentina'
    },
    {
      id: 7,
      firstName: 'Dayle',
      lastName: 'Seel',
      email: 'dseel6@e-recht24.de',
      gender: 'male',
      country: 'China'
    },
    {
      id: 8,
      firstName: 'Nessie',
      lastName: 'Gobell',
      email: 'ngobell7@hhs.gov',
      gender: 'female',
      country: 'Indonesia'
    },
    {
      id: 9,
      firstName: 'Ginelle',
      lastName: 'Sighard',
      email: 'gsighard8@un.org',
      gender: 'female',
      country: 'Philippines'
    },
    {
      id: 10,
      firstName: 'Chanda',
      lastName: 'Gaughan',
      email: 'cgaughan9@xrea.com',
      gender: 'female',
      country: 'Nigeria'
    }
  ];

  dataIds: number[] = this.data.map(item => item.id);

  /*
  Projects each source value to an Observable which is merged in the output Observable,
  in a serialized fashion waiting for each one to complete before merging the next.
  Returns an Observable that emits items based on applying a function that you supply to each
  item emitted by the source Observable, where that function returns an (so-called "inner") Observable.
  Each new inner Observable is concatenated with the previous inner Observable.
  */
  streamConcat$: Observable<string> = from(this.dataIds).pipe(
    concatMap(id => this.getDataById(id))
  );

  /*
  Projects each source value to an Observable which is merged in the output Observable.
  Returns an Observable that emits items based on applying a function that you supply
  to each item emitted by the source Observable, where that function returns an Observable,
  and then merging those resulting Observables and emitting the results of this merger.
  */
  streamMerge$: Observable<string> = from(this.dataIds).pipe(
    mergeMap(id => this.getDataById(id))
  );

  /*
  Projects each source value to an Observable which is merged in the output Observable,
  emitting values only from the most recently projected Observable. Returns an Observable
  that emits items based on applying a function that you supply to each item emitted by
  the source Observable, where that function returns an (so-called "inner") Observable.
  Each time it observes one of these inner Observables, the output Observable begins emitting
  the items emitted by that inner Observable. When a new inner Observable is emitted,
  switchMap stops emitting items from the earlier-emitted inner Observable and begins emitting
  items from the new one. It continues to behave like this for subsequent inner Observables.
  */
  streamSwitch$: Observable<string> = from(this.dataIds).pipe(
    switchMap(id => this.getDataById(id))
  );

  /*
  Projects each source value to an Observable which is merged in the output Observable only if
  the previous projected Observable has completed. Returns an Observable that emits items based on
  applying a function that you supply to each item emitted by the source Observable, where that
  function returns an (so-called "inner") Observable. When it projects a source value to an Observable,
  the output Observable begins emitting the items emitted by that projected Observable. However,
  exhaustMap ignores every new projected Observable if the previous projected Observable
  has not yet completed. Once that one completes, it will accept and flatten the next projected
  Observable and repeat this process.
  */
  streamExhaust$: Observable<string> = from(this.dataIds).pipe(
    exhaustMap(id => this.getDataById(id))
  );

  sub: Subscription | undefined;

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getDataById(id: number): Observable<string> {
    const dataById: IData | null = this.data.find(item => item.id === id) || null;
    return dataById ? of(`${dataById.id}-${dataById.firstName}-${dataById.lastName}`).pipe(
      delay(this.random(1000, 5000))
    ) : of('');
  }

  random(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  onConcatMapClick(): void {
    console.log('concatMap works');
    this.sub = this.streamConcat$.subscribe(value => console.log(value), () => {}, () => { console.log('done'); });
  }

  onMergeMapClick(): void {
    console.log('mergeMap works');
    this.sub = this.streamMerge$.subscribe(value => console.log(value), () => {}, () => { console.log('done'); });
  }

  onSwitchMapClick(): void {
    console.log('switchMap works');
    this.sub = this.streamSwitch$.subscribe(value => console.log(value), () => {}, () => { console.log('done'); });
  }

  onExhaustMapClick(): void {
    console.log('exhaustMap works');
    this.sub = this.streamExhaust$.subscribe(value => console.log(value), () => {}, () => { console.log('done'); });
  }
}
