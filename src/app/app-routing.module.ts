import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListenComponent } from './components/listen/listen.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'listen', component: ListenComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
