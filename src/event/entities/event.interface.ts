export interface EventKey {
  id: string;
}

export interface Event extends EventKey {
  image: string;
  url: string;
  createdAt: Date;
}
