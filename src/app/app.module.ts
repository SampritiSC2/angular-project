import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { RouteGuardService } from './shared/route-guard.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NetworkComponent } from './components/network/network.component';
import { ImageCardComponent } from './components/image-card/image-card.component';
import { FriendComponent } from './components/friend/friend.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { PostComponent } from './components/post/post.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'network',
    component: NetworkComponent,
  },
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
  },
  {
    path: 'friends-list',
    component: FriendsListComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoadingSpinnerComponent,
    ProfileSettingsComponent,
    WelcomeComponent,
    NetworkComponent,
    ImageCardComponent,
    FriendComponent,
    FriendsListComponent,
    PostComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
