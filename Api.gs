function updateBigsellerToken(params) {

  // Logger.log(ScriptApp.getOAuthToken())
  if (!params.token) return { success: false, message: "token not found" }

  const scriptProperties = PropertiesService.getScriptProperties()
  scriptProperties.setProperty('BIGSELLER_COOKIE', params.token)

  return { success: true }
}
