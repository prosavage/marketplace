import {Resource, User, Version} from "@savagelabs/types";
import {getWebhooks} from "../constants";
import axios from "axios";

export const sendUpdate = async (version: Version, resource: Resource, user: User | undefined) => {
    const webhook = await getWebhooks().findOne({resource: resource._id});
    // no configured webhook so we can just exit early.
    if (webhook === null) return;

    let authorEmbedProp;
    if (user) {
        let iconURL = "https://marketplace-savagelabs.b-cdn.net/defaults/default-user.png";
        if (user.hasIcon) {
            iconURL = `https://marketplace-savagelabs.b-cdn.net/users/${user._id}/icon.png`;
        }

        authorEmbedProp = {
            name: user.username,
            url: "https://savagelabs.net/marketplace/users/" + user._id,
            icon_url: iconURL
        }
    }

    let resourceIconURL = "https://marketplace-savagelabs.b-cdn.net/defaults/default-icon.png"
    if (resource.hasIcon) {
        resourceIconURL = `https://marketplace-savagelabs.b-cdn.net/resources/${resource._id}/icon.png`
    }

    axios.post(webhook.url, {
        username: "Marketplace",
        avatar_url: "https://marketplace-savagelabs.b-cdn.net/defaults/savagelabs-icon.png",
        embeds: [
            {
                author: authorEmbedProp,
                title: resource.name,
                url: `https://savagelabs.net/marketplace/resources/${resource._id}`,
                description: "Update Notifier",
                color: 3447003,
                thumbnail: {
                    url: resourceIconURL
                },
                fields: [
                    {
                        name: `${version.title}`,
                        value: `${resource.name} has been updated to version ${version.version}`
                    },
                    {
                        name: "Check it out:",
                        value: `https://savagelabs.net/marketplace/resources/${resource._id}`
                    }
                ],
                footer: {
                    text: "SavageLabs Marketplace",
                }
            }
        ]
    }).then(res => {
        console.log(res.data);
    }).catch(err => console.log(err.response.data))

}
