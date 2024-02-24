const express = require('express');
const https = require('https');
const { Client }  = require("@notionhq/client")
const { config } = require("dotenv")

config();
const apiKey = process.env.NOTION_API_KEY;
const rootPageId = process.env.ROOT_PAGE_ID;
const notion = new Client({ auth: apiKey })

const app = express();

async function getRandomUser() {
    const url = 'https://randomuser.me/api';
    const response = await fetch(url);
    const json = await response.json();

    return json;
}

async function createPage(title) {
    try {
        const response = await notion.pages.create({
            parent: { page_id: rootPageId },
            properties: {
                title: [
                    {
                        text: {
                            content: title
                        }
                    }
                ]
            }
        });
        return response.id;
    } catch (error) {
        console.error("Error creating page:", error.body);
        throw error;
    }
}

app.get('/data', async (request, response) => {
    const page = await createPage('Example Page');
    const user = await getRandomUser();
    response.json({ 'success': true, page, user })
});



app.listen(3000, () => {
    console.log('listening');
})