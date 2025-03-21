import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../../shared/data-access/generic-http/generic-http.service';
import { SubjectDto, SubjectModel } from '../models/subjects.interfaces';
import { SubjectsModelAdapter } from '../adapters/subjects.adapter';

@Injectable({
  providedIn: 'root',
})
export class SubjectsHttpService extends GenericHttpService<
  SubjectDto,
  SubjectModel
> {
  constructor(private concreteAdapter: SubjectsModelAdapter) {
    super('/subjects', concreteAdapter);
  }
}
