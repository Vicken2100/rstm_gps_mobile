export interface BaseResult {
  xid: string;
  updatedAt: number;
  createdAt: number;
  modifiedBy: {
    xid: string;
    username: string;
  };
  version: number;
}

export interface Responses<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface ListResult<T> {
  items: T[];
  count: number;
}

export type List_Payload = {
  skip: number;
  limit: number;
  sortBy: string;
  showAll: boolean;
  filters: Record<string, unknown>;
};

export const DefaultListPayload: List_Payload = {
  skip: 0,
  limit: 10,
  sortBy: "createdAt-desc",
  showAll: false,
  filters: {},
};
