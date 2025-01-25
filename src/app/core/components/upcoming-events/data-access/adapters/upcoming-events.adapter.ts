import { inject, Injectable } from '@angular/core';
import { ModelAdapter } from '../../../../../shared/data-access/model-adapter/model-adapter.interface';
import { EventDto, EventModel } from '../models/upcoming-events.interfaces';
import { SubjectsModelAdapter } from '../../../../../pages/subjects/data-access/adapters/subjects.adapter';

@Injectable({
  providedIn: 'root',
})
export class EventModelAdapter implements ModelAdapter<EventDto, EventModel> {
  private subjectAdapter = inject(SubjectsModelAdapter);

  fromDto(dto: EventDto): EventModel {
    return {
      id: dto.id,
      subject: this.subjectAdapter.fromDto(dto.subject),
      date: dto.date,
    };
  }

  toDto(model: EventModel): EventDto {
    return {
      id: model.id,
      subject: this.subjectAdapter.toDto(model.subject),
      date: model.date,
    };
  }
}
