import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (
  control: AbstractControl
):
  | Promise<{ [key: string]: any } | null>
  | Observable<{ [key: string]: any } | null> => {
  if (typeof control.value === 'string') {
    return of(null);
  }
  const file = control.value;
  const fileReader = new FileReader();
  const fileReaderObservable = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(file).subarray(0, 4);
        let header = '';
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ff8ffe0':
          case 'ff8ffe1':
          case 'ff8ffe2':
          case 'ff8ffe3':
          case 'ff8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; //Or you can use blob.type as fallbac
            break;
        }
        if (isValid) {
          observer.next({ validMime: null });
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return fileReaderObservable;
};
