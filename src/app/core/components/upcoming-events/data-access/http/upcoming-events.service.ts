import { Injectable } from '@angular/core';
import { EventDto, EventModel } from '../models/upcoming-events.interfaces';
import { EventModelAdapter } from '../adapters/upcoming-events.adapter';
import { GenericHttpService } from '../../../../../shared/data-access/generic-http/generic-http.service';

@Injectable({
  providedIn: 'root',
})
export class UpcomingEventsService extends GenericHttpService<
  EventDto,
  EventModel
> {
  constructor(private concreteAdapter: EventModelAdapter) {
    super('/events', concreteAdapter);
  }
}
