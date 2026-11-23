/**
 * Single expiry level row defining day ranges before expiry and notification settings.
 */
export interface ExpiryLevelModel {
  level: number;
  daysFrom: number;
  daysTo: number;
  enableNotification: boolean;
}
