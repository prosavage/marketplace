import Axios, { AxiosInstance } from "axios";
import { UploadedFile } from "express-fileupload";
import { createReadStream, ReadStream } from "fs";
import { ObjectId } from "mongodb";
import { Resource, ResourceType } from "../types/Resource";
import { Version } from "../types/Version";


export class BunnyCDNStorage {

    bunnyAxios!: AxiosInstance;

    constructor() {
        this.bunnyAxios = Axios.create({
            baseURL: "https://storage.bunnycdn.com/marketplace/",
            headers: { AccessKey: process.env.BUNNY_STORAGE_API_KEY }
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

    getResourcePath = (resourceId: ObjectId) => {
        return `resources/${resourceId}`
    }

    getResourceIconById = (resourceId: ObjectId) => {
        return this.getFile(this.getResourcePath(resourceId), "icon.png")
    }

    putResourceIconById = (resourceId: ObjectId, file: any) => {
        return this.putFile(this.getResourcePath(resourceId), "icon.png", file);
    }

    deleteResourceIconById = (resourceId: ObjectId) => {
        return this.deleteFile(this.getResourcePath(resourceId), "icon.png")
    }

    getResourceIconByResource = (resource: Resource) => {
        return this.getResourceIconById(resource._id)
    }

    deleteResourceIconByResource = (resource: Resource) => {
        return this.deleteResourceIconById(resource._id)
    }

    getVersionPath = (resourceId: ObjectId, versionId: ObjectId) => {
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