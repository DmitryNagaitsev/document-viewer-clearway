import { Routes } from '@angular/router';
import { DocumentViewerComponent } from './components';

export const routes: Routes = [
    { path: 'document/:id', component: DocumentViewerComponent },
    { path: '', redirectTo: '/document/1', pathMatch: 'full' }
];
