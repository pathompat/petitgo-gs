const env = (name) => PropertiesService.getScriptProperties().getProperty(name)

// line notify
const LINE_PERSONAL_TOKEN = env('LINE_PERSONAL_TOKEN')
const LINE_PIG_TOKEN = env('LINE_PIG_TOKEN')
const LINE_PIG_GROUP_ID = env('LINE_PIG_GROUP_ID')

// trello api
const TRELLO_API_KEY = env('TRELLO_API_KEY')

// woocommerce api key
const BASIC_AUTH_WOOCOMMERCE = env('BASIC_AUTH_WOOCOMMERCE')

// firestore setting
const FIRESTORE_EMAIL = env('FIRESTORE_EMAIL')
const FIRESTORE_KEY = env('FIRESTORE_KEY').replace(/\\n/g, '\n')
const FIRESTORE_PROJECT_ID = env('FIRESTORE_PROJECT_ID')

// discord
const WEBHOOK_PETITGO_NOTIFY = env('WEBHOOK_PETITGO_NOTIFY')

// scraper
const COMP_SPREADSHEET_ID = env('COMP_SPREADSHEET_ID')
const COMP_SHEET = env('COMP_SHEET')