const env = (name) => PropertiesService.getScriptProperties().getProperty(name)

// bigseller
const BIGSELLER_COOKIE = PropertiesService.getScriptProperties().getProperty('BIGSELLER_COOKIE')

// line notify
const LINE_PERSONAL_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_PERSONAL_TOKEN')
const LINE_PIG_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_PIG_TOKEN')

// trello api
const TRELLO_API_KEY = PropertiesService.getScriptProperties().getProperty('TRELLO_API_KEY')

// woocommerce api key
const BASIC_AUTH_WOOCOMMERCE = PropertiesService.getScriptProperties().getProperty('BASIC_AUTH_WOOCOMMERCE')

// firestore setting
const FIRESTORE_EMAIL = env('FIRESTORE_EMAIL')
const FIRESTORE_KEY = env('FIRESTORE_KEY').replace(/\\n/g, '\n')
const FIRESTORE_PROJECT_ID = env('FIRESTORE_PROJECT_ID')