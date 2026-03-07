export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface FetchMediaInfoParams {
  url: string;
}

export interface DownloadMediaParams {
  url: string;
  formatId: string;
}
