export function getIntegrationMonogram(providerId: string, providerName: string): string {
  const monograms: Record<string, string> = {
    'salesforce': 'SF',
    'hubspot': 'HS', 
    'slack': 'SL',
    'msteams': 'MS',
    'google-drive': 'GD',
    'sharepoint': 'SP',
    'confluence': 'CF',
    'notion': 'NT',
    'highspot': 'HS',
    'seismic': 'SM',
    'gong': 'GG',
    'avoma': 'AV',
    'zendesk': 'ZD',
    'intercom': 'IC',
    'zapier': 'ZP',
    'google-sheets': 'GS',
    'chorus': 'CH',
    'clari': 'CL',
    'mindtickle': 'MT',
    'mindtickle-call-ai': 'MC',
    'salesloft': 'SL',
    'salesforce-knowledge': 'SK',
    'document360': 'D360',
    'crayon': 'CR',
    'jira': 'JR',
    'google-calendar': 'GC'
  }
  
  return monograms[providerId] || providerName.substring(0, 2).toUpperCase()
}

export function getIntegrationBrandColor(providerId: string): string {
  const brandColors: Record<string, string> = {
    'salesforce': 'from-blue-600 to-blue-700', // Salesforce blue
    'hubspot': 'from-orange-500 to-orange-600', // HubSpot orange
    'slack': 'from-purple-600 to-purple-700', // Slack purple
    'msteams': 'from-blue-500 to-blue-600', // Microsoft blue
    'google-drive': 'from-blue-500 to-green-500', // Google colors
    'sharepoint': 'from-blue-600 to-blue-700', // Microsoft blue
    'confluence': 'from-blue-600 to-blue-700', // Atlassian blue
    'notion': 'from-gray-800 to-gray-900', // Notion black
    'highspot': 'from-red-500 to-red-600', // Highspot red
    'seismic': 'from-green-600 to-green-700', // Seismic green
    'gong': 'from-purple-600 to-purple-700', // Gong purple
    'avoma': 'from-blue-600 to-blue-700', // Avoma blue
    'zendesk': 'from-green-600 to-green-700', // Zendesk green
    'intercom': 'from-blue-500 to-blue-600', // Intercom blue
    'zapier': 'from-orange-500 to-orange-600', // Zapier orange
    'google-sheets': 'from-green-600 to-green-700', // Google Sheets green
    'chorus': 'from-purple-600 to-purple-700', // Chorus purple
    'clari': 'from-blue-600 to-blue-700', // Clari blue
    'mindtickle': 'from-blue-600 to-blue-700', // Mindtickle blue
    'mindtickle-call-ai': 'from-blue-600 to-blue-700', // Mindtickle blue
    'salesloft': 'from-blue-600 to-blue-700', // Salesloft blue
    'salesforce-knowledge': 'from-blue-600 to-blue-700', // Salesforce blue
    'document360': 'from-blue-600 to-blue-700', // Document360 blue
    'crayon': 'from-purple-600 to-purple-700', // Crayon purple
    'jira': 'from-blue-600 to-blue-700', // Atlassian blue
    'google-calendar': 'from-blue-500 to-green-500' // Google colors
  }
  
  return brandColors[providerId] || 'from-gray-600 to-gray-700'
}

type IntegrationAvatarProps = {
  providerId: string
  providerName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function IntegrationAvatar({ 
  providerId, 
  providerName, 
  size = 'md',
  className = ""
}: IntegrationAvatarProps) {
  const monogram = getIntegrationMonogram(providerId, providerName)
  const brandColor = getIntegrationBrandColor(providerId)
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm', 
    lg: 'h-12 w-12 text-base'
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${brandColor} flex items-center justify-center ${className}`}>
      <span className="font-bold text-white">{monogram}</span>
    </div>
  )
}
