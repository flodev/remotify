export interface CreateObjectFromModel<M, O> {
  create(model: M): O
}
