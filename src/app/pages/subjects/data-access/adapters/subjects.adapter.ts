import { ModelAdapter } from '../../../../shared/data-access/model-adapter/model-adapter.interface';
import { SubjectDto, SubjectModel } from '../models/subjects.interfaces';

export class SubjectsModelAdapter
  implements ModelAdapter<SubjectDto, SubjectModel>
{
  fromDto(dto: SubjectDto): SubjectModel {
    return {
      id: dto.id,
      title: dto.title,
      code: dto.code,
      color: dto.color,
      gpa: dto.gpa,
    };
  }

  toDto(model: SubjectModel): SubjectDto {
    return {
      id: model.id,
      title: model.title,
      code: model.code,
      color: model.color,
      gpa: model.gpa,
    };
  }
}
