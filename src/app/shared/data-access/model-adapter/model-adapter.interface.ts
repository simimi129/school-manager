export interface ModelAdapter<D, M> {
  fromDto(dto: D): M;
  toDto(model: M): D;
}
