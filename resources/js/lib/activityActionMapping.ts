/**
 * Activity Action Color and Icon Mapping
 * 
 * This module provides the mapping logic for activity action types
 * to their corresponding colors and cultural icons.
 * 
 * Requirements: 3.2 (color-coded badges), 3.3 (cultural icons)
 */

// Valid action types
export type ActionType = 'created' | 'updated' | 'deleted'

// Color mapping for action types - Requirements: 3.2
// Green for created, Blue for updated, Red for deleted
export const ACTION_COLORS: Record<ActionType, string> = {
  created: 'bg-green-100 text-green-800',
  updated: 'bg-blue-100 text-blue-800',
  deleted: 'bg-red-100 text-red-800',
}

// Dot colors for timeline - Requirements: 3.1
export const DOT_COLORS: Record<ActionType, string> = {
  created: 'bg-green-500',
  updated: 'bg-blue-500',
  deleted: 'bg-red-500',
}

// Icon colors for cultural icons - Requirements: 3.3
export const ICON_COLORS: Record<ActionType, string> = {
  created: 'text-green-600',
  updated: 'text-blue-600',
  deleted: 'text-red-600',
}

// Cultural icon names for action types - Requirements: 3.3
// Lontar for created, CepatMenulis for updated, Prasasti for deleted
export const ACTION_ICON_NAMES: Record<ActionType, string> = {
  created: 'Lontar',
  updated: 'CepatMenulis',
  deleted: 'Prasasti',
}

// Action labels in Indonesian
export const ACTION_LABELS: Record<ActionType, string> = {
  created: 'Dibuat',
  updated: 'Diperbarui',
  deleted: 'Dihapus',
}

// Default fallback values
export const DEFAULT_COLOR = 'bg-gray-100 text-gray-800'
export const DEFAULT_DOT_COLOR = 'bg-tw-batik-blue'
export const DEFAULT_ICON_COLOR = 'text-gray-400'
export const DEFAULT_ICON_NAME = 'Activity'

/**
 * Get all valid action types
 */
export function getAllActionTypes(): ActionType[] {
  return ['created', 'updated', 'deleted']
}

/**
 * Check if a string is a valid action type
 */
export function isValidActionType(action: string): action is ActionType {
  return getAllActionTypes().includes(action as ActionType)
}

/**
 * Get the color class for an action type
 * Returns the correct color: green for created, blue for updated, red for deleted
 */
export function getActionColor(action: string): string {
  if (isValidActionType(action)) {
    return ACTION_COLORS[action]
  }
  return DEFAULT_COLOR
}

/**
 * Get the dot color for timeline display
 */
export function getDotColor(action: string): string {
  if (isValidActionType(action)) {
    return DOT_COLORS[action]
  }
  return DEFAULT_DOT_COLOR
}

/**
 * Get the icon color for cultural icons
 */
export function getIconColor(action: string): string {
  if (isValidActionType(action)) {
    return ICON_COLORS[action]
  }
  return DEFAULT_ICON_COLOR
}

/**
 * Get the cultural icon name for an action type
 * Returns: Lontar for created, CepatMenulis for updated, Prasasti for deleted
 */
export function getActionIconName(action: string): string {
  if (isValidActionType(action)) {
    return ACTION_ICON_NAMES[action]
  }
  return DEFAULT_ICON_NAME
}

/**
 * Get the action label in Indonesian
 */
export function getActionLabel(action: string): string {
  if (isValidActionType(action)) {
    return ACTION_LABELS[action]
  }
  return action
}

/**
 * Get complete action mapping for an action type
 * Returns all styling and icon information for an action
 */
export function getActionMapping(action: string): {
  color: string
  dotColor: string
  iconColor: string
  iconName: string
  label: string
  isValid: boolean
} {
  const isValid = isValidActionType(action)
  return {
    color: getActionColor(action),
    dotColor: getDotColor(action),
    iconColor: getIconColor(action),
    iconName: getActionIconName(action),
    label: getActionLabel(action),
    isValid,
  }
}

/**
 * Verify that an action has the correct color mapping
 * Used for property-based testing
 */
export function verifyActionColorMapping(action: ActionType): boolean {
  const color = getActionColor(action)
  
  switch (action) {
    case 'created':
      return color.includes('green')
    case 'updated':
      return color.includes('blue')
    case 'deleted':
      return color.includes('red')
    default:
      return false
  }
}

/**
 * Verify that an action has the correct cultural icon mapping
 * Used for property-based testing
 */
export function verifyActionIconMapping(action: ActionType): boolean {
  const iconName = getActionIconName(action)
  
  switch (action) {
    case 'created':
      return iconName === 'Lontar'
    case 'updated':
      return iconName === 'CepatMenulis'
    case 'deleted':
      return iconName === 'Prasasti'
    default:
      return false
  }
}
