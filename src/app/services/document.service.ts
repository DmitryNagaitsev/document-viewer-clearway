import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentInfo } from '../models/document.model';
import mockDocument from '../../assets/1.json';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  getDocumentById(id: string): Observable<DocumentInfo> {
    console.log('Загружаем документ: ', id);
    return of(mockDocument as DocumentInfo);
  }
}