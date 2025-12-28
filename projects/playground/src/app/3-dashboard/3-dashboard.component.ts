import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { TransactionsService } from '../transactions.service';
import { SparklineService } from '../sparkline.service';
import { ServerUtilizationService } from '../server-utilization.service';
import { ProcessManagerService } from '../process-manager.service';

@Component({
  selector: 'pl-3-dashboard',
  standalone: true,
  imports: [AsyncPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <grid rows="12" cols="12">
      <line
        [row]="0"
        [col]="0"
        [rowSpan]="3"
        [colSpan]="3"
        label="Total Transactions"
        [data]="transactions$ | async">
      </line>

      <bar
        [row]="0"
        [col]="3"
        [rowSpan]="3"
        [colSpan]="3"
        label="Server Utilization (%)"
        [barWidth]="4"
        [barSpacing]="6"
        [xOffset]="3"
        [maxHeight]="9"
        [data]="serversUtilization$ | async">
      </bar>

      <line
        [row]="0"
        [col]="6"
        [rowSpan]="6"
        [colSpan]="6"
        label="Total Transactions"
        [data]="transactions$ | async">
      </line>

      <contrib-table
        [row]="3"
        [col]="0"
        [rowSpan]="3"
        [colSpan]="6"
        fg="green"
        label="Active Processes"
        [keys]="true"
        [columnSpacing]="1"
        [columnWidth]="[28,20,20]"
        [data]="process$ | async">
      </contrib-table>

      <map
        [row]="6"
        [col]="0"
        [rowSpan]="6"
        [colSpan]="9"
        label="Servers Location">
      </map>

      <sparkline
        row="6"
        col="9"
        rowSpan="6"
        colSpan="3"
        label="Throughput (bits/sec)"
        [tags]="true"
        [style]="{ fg: 'blue', titleFg: 'white', border: {} }"
        [data]="sparkline$ | async">
      </sparkline>
    </grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly transactionsService = inject(TransactionsService);
  private readonly sparklineService = inject(SparklineService);
  private readonly serversUtilization = inject(ServerUtilizationService);
  private readonly processManager = inject(ProcessManagerService);

  transactions$ = this.transactionsService.transactions$;
  sparkline$ = this.sparklineService.sparkline$;
  serversUtilization$ = this.serversUtilization.serversUtilization$;
  process$ = this.processManager.process$;
}
