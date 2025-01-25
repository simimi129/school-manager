import {
  SubjectDto,
  SubjectModel,
} from '../../../../../pages/subjects/data-access/models/subjects.interfaces';

export interface EventDto {
  id: string;
  subject: SubjectDto;
  date: Date | string;
}

export interface EventModel {
  id: string;
  subject: SubjectModel;
  date: Date | string;
}
