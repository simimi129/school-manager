import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { ModelAdapter } from '../model-adapter/model-adapter.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenericHttpService<D, M> {
  protected url;
  defaultHeaders = new HttpHeaders();
  protected readonly http = inject(HttpClient);

  constructor(
    @Inject(String) private endpoint: string,
    @Inject('ModelAdapter') private adapter: ModelAdapter<D, M>,
    @Inject(String) private baseUrl: string = environment.baseUrl
  ) {
    this.url = `${this.baseUrl}/api${this.endpoint}`;
  }

  public get(extraHttpRequestParams?: Partial<HttpHeaders>): Observable<M[]> {
    return this.http
      .get<D[]>(this.url, this.prepareRequestOptions(extraHttpRequestParams))
      .pipe(
        map(
          (data: D[]) => data.map((item) => this.adapter.fromDto(item)) as M[]
        )
      );
  }

  public post(
    body: M,
    extraHttpRequestParams?: Partial<HttpHeaders>
  ): Observable<M> {
    return this.http
      .post(
        this.url,
        this.adapter.toDto(body),
        this.prepareRequestOptions(extraHttpRequestParams)
      )
      .pipe(
        map((data) => this.adapter.fromDto(data as D) as M)
      ) as Observable<M>;
  }

  public put(
    body: M,
    id: number,
    extraHttpRequestParams?: Partial<HttpHeaders>
  ): Observable<M> {
    return this.http
      .put(
        `${this.url}/${id}`,
        this.adapter.toDto(body),
        this.prepareRequestOptions(extraHttpRequestParams)
      )
      .pipe(
        map((data) => this.adapter.fromDto(data as D) as M)
      ) as Observable<M>;
  }

  public delete(
    id: number,
    extraHttpRequestParams?: Partial<HttpHeaders>
  ): Observable<M> {
    return this.http
      .delete(
        `${this.url}/${id}`,
        this.prepareRequestOptions(extraHttpRequestParams)
      )
      .pipe(
        map((data) => this.adapter.fromDto(data as D) as M)
      ) as Observable<M>;
  }

  prepareRequestOptions(extraHttpRequestParams = {}) {
    return {
      headers: Object.assign(this.defaultHeaders, extraHttpRequestParams),
    };
  }
}
