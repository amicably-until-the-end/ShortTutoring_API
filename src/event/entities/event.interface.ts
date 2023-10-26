export interface EventKey {
  id: string;
}

export interface Event extends EventKey {
  image: string;
  url: string;
  title: string;
  authority: Set<string>;
  createdAt: Date;
}
