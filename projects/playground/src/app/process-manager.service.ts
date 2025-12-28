import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface ProcessTable {
  headers: string[];
  data: (string | number)[][];
}

const commands = ['grep', 'node', 'java', 'timer', '~/ls -l', 'netns', 'watchdog', 'gulp', 'tar -xvf', 'awk', 'npm install'];

function generateTable(): ProcessTable {
  const data: (string | number)[][] = [];

  for (let i = 0; i < 30; i++) {
    const row: (string | number)[] = [];
    row.push(commands[Math.round(Math.random() * (commands.length - 1))]);
    row.push(Math.round(Math.random() * 5));
    row.push(Math.round(Math.random() * 100));
    data.push(row);
  }

  return { headers: ['Process', 'Cpu (%)', 'Memory'], data };
}

@Injectable({ providedIn: 'root' })
export class ProcessManagerService {
  readonly process$: Observable<ProcessTable> = of(generateTable());
}
