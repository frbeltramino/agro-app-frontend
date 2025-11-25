import { Campaign } from "./campaign.interface";


export interface CampaingsResponse {
    campaigns: Campaign[];
    pagination: Pagination;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}


export interface CampaignsResponse {
    campaigns: Campaign[];
    pagination: Pagination;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
