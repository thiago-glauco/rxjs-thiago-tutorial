import { Observable, of, fromEvent } from 'rxjs'; 
import { map, scan, throttleTime, filter } from 'rxjs/operators';


const source = of('World').pipe(
  map(x => `Hello ${x}!`)
);

source.subscribe(x => console.log(x));

const obs = fromEvent(document, 'click');
let subscription2 = obs.pipe(
  throttleTime(1000),
  map( (event: MouseEvent) => event.clientX ),
  scan( (count, clientX) => count + clientX, 0)
)
.subscribe(
  (count) => console.log(`clicked ${count} times`)
);
console.log(subscription2);

const timerObs = Observable.create( (observer) => {
  const dataStream = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let iterator = 0;
  try {
    observer.next(0);
    let id = setInterval ( () => {
      if ( iterator < dataStream.length ){
        observer.next(dataStream[iterator]);
        iterator++;
      }
      else {
        clearInterval(id);
        observer.complete();
      }
    }, 1000 );
  } catch (err) {
    console.dir(err);
  }
});

timerObs.pipe(
  filter( (x: number) => {return !(x%2)} )
).subscribe(
  {
    next: x => console.log(`it is ${x} passed from subscription`),
    error: err => console.error('something wrong occurred: ' + err),
    complete: () => console.log('observable is complete: 11 seconds from subscripton')
  }
);

const subscription = timerObs.subscribe(
   x => console.log(`it is ${x} passed from subscription`)
)

console.log(subscription);


