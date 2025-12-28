import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ServerUtilization {
  titles: string[];
  data: number[];
}

const servers = ['US1', 'US2', 'EU1', 'AU1'];

function getServersUtilization(): ServerUtilization {
  const arr: number[] = [];
  for (let i = 0; i < servers.length; i++) {
    arr.push(Math.round(Math.random() * 10));
  }
  return { titles: servers, data: arr };
}

@Injectable({ providedIn: 'root' })
export class ServerUtilizationService {
  readonly serversUtilization$: Observable<ServerUtilization> = interval(750).pipe(
    map(() => getServersUtilization())
  );
}
