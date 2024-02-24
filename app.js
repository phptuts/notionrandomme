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
    const url = 'https://randomuser.me/api?nat=us';
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

function createCell(text) {
    return [
        {
          "type": "text",
          "text": {
            "content": text,
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": text,
          "href": null
        }
      ];
}

function createRow(cellText1, cellText2) {
    return {
        type: "table_row",
        table_row: {
            cells: [
               createCell(cellText1),
               createCell(cellText2)
            ],
        }
    }
}

async function createTable(pageId, rows) 
{
    const children = [
        createRow('Key', 'Value'),
        ...rows.map(keyValue => {
            return createRow(keyValue.key, keyValue.value);
    })];
    await notion.blocks.children.append({
        block_id: pageId,
        children: [
            {
                object: 'block',
                type: 'table',
                table: {
                    table_width: 2,
                    has_row_header: true,
                    children
                }
            }
        ]
    });
}

app.get('/data', async (request, response) => {
    const data = await getRandomUser();
    const user = data.results[0];
    const pageName = `${user.name.first}'s Page`;
    const pageId = await createPage(pageName);
    const rows = [
        {key: 'Name', value: `${user.name.first} ${user.name.last}` },
        {key: 'Gender', value: user.gender},
        {key: 'Country', value: user.location.country},
        {key: 'Email', value: user.email},
    ]
    createTable(pageId, rows);
    response.json({ 'success': true })
});



app.listen(3000, () => {
    console.log('listening');
})