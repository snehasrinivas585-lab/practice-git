// Shared admin access code store — read by AuthModal, written by ASettings
let ADMIN_CODE = 'PUJI@ADMIN2024'

export function getAdminCode()          { return ADMIN_CODE }
export function setAdminCode(newCode)   { ADMIN_CODE = newCode }
