import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'sign-document',
    redirectTo: 'sign-folder',
    pathMatch: 'full'
  },
  {
    path: 'sign-folder',
    loadComponent: () => import('./pages/sign-folder/sign-folder.component').then(m => m.SignFolderComponent)
  },
  {
    path: 'result',
    loadComponent: () => import('./pages/result/result.component').then(m => m.ResultComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
