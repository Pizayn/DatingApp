import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../_models/user";
import { PaginationResult } from "../_models/Pagination";
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

// const httpOptions={
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page?, itemsPerPage?,userParams?,likesParam?): Observable<PaginationResult<User[]>> {
    const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("pageNumber", page);
      params = params.append("pageSize", itemsPerPage);
    }
    if(userParams!=null){  
      params=params.append('minAge',userParams.minAge);
      params=params.append('maxAge',userParams.maxAge);
      params=params.append('gender',userParams.gender);
      params=params.append('orderBy',userParams.orderBy);


    }
    if(likesParam=== 'Likers'){
      params=params.append('likers','true');
    }
    if(likesParam=== 'Likees'){
      params=params.append('likees','true');
    }

    return this.http.get<User[]>(this.baseUrl + "users",{observe:'response',params}).pipe(
      map(response=>{
        paginationResult.result=response.body;         //response body ile verilen parametrelere göre verileri aldık user gelcek apiden
        if(response.headers.get('Pagination')!=null){          //headersdan ise verilen parametrelerin değerlerini aldık page 1 pagesize=3 gibi
          paginationResult.pagination=JSON.parse(response.headers.get('Pagination'))  //jsonu çevirdik
        }
        return paginationResult;
      })
    );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id);
  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + "users/" + id, user);
  }
  setMainPhoto(userId, photoId) {
    return this.http.post(
      this.baseUrl + "users/" + userId + "/photos/" + photoId + "/setMain",
      {}
    );
  }
  DeletePhoto(userId, photoId) {
    return this.http.delete(
      this.baseUrl + "users/" + userId + "/photos/" + photoId
    );
  }
  sendLike(id:number,recipentId:number){
    return this.http.post(this.baseUrl+'users/'+ id +'/like/'+recipentId,{});
  }
  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();
    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
           }
          return paginatedResult;
          }));
  }
  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }
  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }
  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }
  markAsRead(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id + '/read', {}).subscribe();
  }
}
