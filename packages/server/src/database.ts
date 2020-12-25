import { RESOURCES_COLLECTION } from "./constants";
import { getDatabase } from "./server";

const ensureIndexes = async () => {
    await getDatabase().collection(RESOURCES_COLLECTION).createIndex({ updated: -1 })
}

export default ensureIndexes;