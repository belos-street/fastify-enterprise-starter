export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: 0, message, data }
}

export function error(message: string, code = -1): ApiResponse<null> {
  return { code, message, data: null }
}

export function paginated<T>(
  list: T[],
  total: number,
  page: number,
  pageSize: number,
): ApiResponse<PaginatedData<T>> {
  return {
    code: 0,
    message: 'success',
    data: { list, total, page, pageSize },
  }
}
