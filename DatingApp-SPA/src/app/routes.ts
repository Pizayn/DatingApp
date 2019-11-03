import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListlResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PrevenUnssavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListslResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {
        path:'', //buranın içine pizayn bişey yazarsak localhost/pizayn/altdaki değeerler gelir members gibi
        runGuardsAndResolvers:'always',
        canActivate:[AuthGuard],
        children:[
            {path: 'members', component: MemberListComponent, resolve: {users: MemberListlResolver}},
            {path: 'members/:id', component: MemberDetailComponent, resolve:{user: MemberDetailResolver}},
            {path: 'member/edit', component: MemberEditComponent,resolve:{user:MemberEditResolver},canDeactivate:[PrevenUnssavedChanges]},
//kaydetmeden çıkmamak için candeactive
            {path: 'messages', component: MessagesComponent,resolve:{messages:MessagesResolver}},
            {path:'lists', component: ListsComponent,resolve: {users:ListslResolver}}, 

        ]
       
    },
    {path: '**', redirectTo: '', pathMatch: 'full'},
   
   

];