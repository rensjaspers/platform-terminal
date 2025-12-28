import { bootstrapTerminalApplication } from 'platform-terminal';

import { AppComponent } from './app/app.component';

bootstrapTerminalApplication(AppComponent).catch((err) => console.error(err));
