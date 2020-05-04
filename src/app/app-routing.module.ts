import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListenComponent } from './components/listen/listen.component';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'listen', component: ListenComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
