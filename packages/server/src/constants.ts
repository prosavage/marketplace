import {getDatabase} from "./server";
import {
    Category,
    Download,
    Payment,
    Resource,
    Review,
    Seller,
    Team,
    TeamInvite,
    User,
    Version
} from "@savagelabs/types";
import {Webhook} from "@savagelabs/types/src/Webhook";
export const USERS_COLLECTION = "users";
export const RESOURCES_COLLECTION = "resources";
export const CATEGORIES_COLLECTION = "categories";
export const VERSIONS_COLLECTION = "versions";
export const REVIEWS_COLLECTION = "reviews";
export const TOKENS_COLLECTION = "tokens";
export const SELLER_COLLECTION = "sellers";
export const PAYMENTS_COLLECTION = "payments";
export const WEBHOOKS_COLLECTION = "webhooks";
export const DOWNLOADS_COLLECTION = "downloads";
export const INVITED_COLLECTION = "invites"
export const TEAMS_COLLECTION = "teams"


export const getUsers = () => {
    return getDatabase().collection<User>(USERS_COLLECTION);
}

export const getResources = () => {
    return getDatabase().collection<Resource>(RESOURCES_COLLECTION);
}

export const getCategories = () => {
    return getDatabase().collection<Category>(CATEGORIES_COLLECTION);
}

export const getVersions = () => {
    return getDatabase().collection<Version>(VERSIONS_COLLECTION);
}

export const getReviews = () => {
    return getDatabase().collection<Review>(REVIEWS_COLLECTION);
}

export const getTokens = () => {
    return getDatabase().collection(USERS_COLLECTION);
}

export const getSeller = () => {
    return getDatabase().collection<Seller>(SELLER_COLLECTION);
}

export const getPayments = () => {
    return getDatabase().collection<Payment>(PAYMENTS_COLLECTION);
}

export const getWebhooks = () => {
    return getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION);
}

export const getDownloads = () => {
    return getDatabase().collection<Download>(DOWNLOADS_COLLECTION);
}

export const getInvites = () => {
    return getDatabase().collection<TeamInvite>(INVITED_COLLECTION);
}

export const getTeams = () => {
    return getDatabase().collection<Team>(TEAMS_COLLECTION);
}

