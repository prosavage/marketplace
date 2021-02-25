import Axios, {AxiosInstance} from "axios";
import {UploadedFile} from "express-fileupload";

import {Resource} from "../types/Resource";
import {Version} from "../types/Version";


export class BunnyCDNStorage {

    bunnyAxios!: AxiosInstance;

    constructor() {
        this.bunnyAxios = Axios.create({
            baseURL: "https://storage.bunnycdn.com/marketplace/",
            headers: {AccessKey: process.env.BUNNY_STORAGE_API_KEY}
        });
    }

    getFile = (path: string, file: string) => {
        return this.bunnyAxios.get(path + "/" + file)
    }

    putFile = async (path: string, name: string, file: UploadedFile) => {
        return this.bunnyAxios.put(path + "/" + name, file);
    }

    deleteFile = (path: string, file: string) => {
        return this.bunnyAxios.delete(path + "/" + file)
    }

    getResourcePath = (resourceId: string) => {
        return `resources/${resourceId}`
    }

    getUserPath = (userId: string) => {
        return `users/${userId}`
    }

    getResourceIconById = (resourceId: string) => {
        return this.getFile(this.getResourcePath(resourceId), "icon.png")
    }

    putResourceIconById = (resourceId: string, file: any) => {
        return this.putFile(this.getResourcePath(resourceId), "icon.png", file);
    }

    deleteResourceIconById = (resourceId: string) => {
        return this.deleteFile(this.getResourcePath(resourceId), "icon.png")
    }

    getResourceIconByResource = (resource: Resource) => {
        return this.getResourceIconById(resource._id)
    }

    deleteResourceIconByResource = (resource: Resource) => {
        return this.deleteResourceIconById(resource._id)
    }

    getUserIconById = (resourceId: string) => {
        return this.getFile(this.getUserPath(resourceId), "icon.png")
    }

    putUserIconById = (resourceId: string, file: any) => {
        return this.putFile(this.getUserPath(resourceId), "icon.png", file);
    }

    deleteUserIconById = (resourceId: string) => {
        return this.deleteFile(this.getUserPath(resourceId), "icon.png")
    }

    getUserIconByResource = (resource: Resource) => {
        return this.getUserIconById(resource._id)
    }

    deleteUserIconByResource = (resource: Resource) => {
        return this.deleteUserIconById(resource._id)
    }

    getVersionPath = (resourceId: string, versionId: string) => {
        return `resources/${resourceId}/${versionId}`
    }

    getVersionFileName = (resource: Resource, version: Version) => {
        return `${resource.name}-${version.version}-${version._id}`
    }

    putVersionFile = (resource: Resource, version: Version, file: UploadedFile) => {
        return this.putFile(this.getVersionPath(resource._id, version._id), this.getVersionFileName(resource, version), file)
    }

    deleteVersionFile = (resource: Resource, version: Version) => {
        return this.deleteFile(this.getVersionPath(resource._id, version._id), this.getVersionFileName(resource, version))
    }

    getVersionFile = (resource: Resource, version: Version) => {
        return this.getFile(this.getVersionPath(resource._id, version._id), this.getVersionFileName(resource, version))
    }

}
