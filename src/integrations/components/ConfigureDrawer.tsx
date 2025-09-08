import { Fragment, useState } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import type { IntegrationProvider } from '../types'
import { useIntegrationsStore } from '../store'
import { FieldMappingConfigPanel } from './FieldMappingConfig'
import { CommunicationConfigPanel } from './CommunicationConfig'
import { DocumentConfigPanel } from './DocumentConfig'
import { CallIntelligenceConfigPanel } from './CallIntelligenceConfig'
import { NotionConfigPanel } from './NotionConfig'
import { ConfluenceConfigPanel } from './ConfluenceConfig'
import { GoogleSheetsConfigPanel } from './GoogleSheetsConfig'
import { HighspotConfigPanel } from './HighspotConfig'
import { ZendeskConfigPanel } from './ZendeskConfig'
import { IntercomConfigPanel } from './IntercomConfig'
import { ZapierConfigPanel } from './ZapierConfig'
import { ChorusConfigPanel } from './ChorusConfig'
import { MindtickleConfigPanel } from './MindtickleConfig'
import { SalesloftConfigPanel } from './SalesloftConfig'
import { SalesforceKnowledgeConfigPanel } from './SalesforceKnowledgeConfig'
import { CrayonConfigPanel } from './CrayonConfig'
import { JiraConfigPanel } from './JiraConfig'
import { GoogleCalendarConfigPanel } from './GoogleCalendarConfig'

export function ConfigureDrawer({ provider, open, onClose }: { provider: IntegrationProvider; open: boolean; onClose: () => void }) {

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex justify-end p-2">
          <Dialog.Panel className="h-full w-[600px] rounded-xl border border-gray-200/50 bg-white shadow-2xl shadow-black/10">
            {(provider.id === 'salesforce' || provider.id === 'hubspot') ? (
              <FieldMappingConfigPanel provider={provider} onClose={onClose} />
            ) : (provider.id === 'slack' || provider.id === 'msteams') ? (
              <CommunicationConfigPanel provider={provider} onClose={onClose} />
            ) : provider.id === 'notion' ? (
              <NotionConfigPanel onClose={onClose} />
            ) : provider.id === 'confluence' ? (
              <ConfluenceConfigPanel onClose={onClose} />
            ) : provider.id === 'google-sheets' ? (
              <GoogleSheetsConfigPanel onClose={onClose} />
            ) : (provider.id === 'highspot' || provider.id === 'seismic') ? (
              <HighspotConfigPanel onClose={onClose} />
            ) : (provider.id === 'google-drive' || provider.id === 'sharepoint') ? (
              <DocumentConfigPanel provider={provider} onClose={onClose} />
            ) : (provider.id === 'gong' || provider.id === 'avoma') ? (
              <CallIntelligenceConfigPanel provider={provider} onClose={onClose} />
            ) : provider.id === 'zendesk' ? (
              <ZendeskConfigPanel onClose={onClose} />
            ) : provider.id === 'intercom' ? (
              <IntercomConfigPanel onClose={onClose} />
            ) : provider.id === 'zapier' ? (
              <ZapierConfigPanel onClose={onClose} />
            ) : (provider.id === 'chorus' || provider.id === 'clari') ? (
              <ChorusConfigPanel onClose={onClose} />
            ) : (provider.id === 'mindtickle' || provider.id === 'mindtickle-call-ai') ? (
              <MindtickleConfigPanel onClose={onClose} />
            ) : provider.id === 'salesloft' ? (
              <SalesloftConfigPanel onClose={onClose} />
            ) : provider.id === 'salesforce-knowledge' ? (
              <SalesforceKnowledgeConfigPanel onClose={onClose} />
            ) : provider.id === 'crayon' ? (
              <CrayonConfigPanel onClose={onClose} />
            ) : provider.id === 'document360' ? (
              <ZendeskConfigPanel onClose={onClose} />
            ) : provider.id === 'jira' ? (
              <JiraConfigPanel onClose={onClose} />
            ) : provider.id === 'google-calendar' ? (
              <GoogleCalendarConfigPanel onClose={onClose} />
            ) : (
              <GenericPanel provider={provider} onClose={onClose} />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}

function GenericPanel({ provider, onClose }: { provider: IntegrationProvider; onClose: () => void }) {
  const configure = useIntegrationsStore((s) => s.configure)
  const [syncFiles, setSyncFiles] = useState(true)
  const [syncMetadata, setSyncMetadata] = useState(true)
  const [limitToTeam, setLimitToTeam] = useState(false)

  const save = () => {
    configure(provider.id, { syncFiles, syncMetadata, limitToTeam })
    onClose()
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">{provider.name[0]}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{provider.name} Settings</h2>
            <p className="text-sm text-gray-600">Configure sync preferences</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <Section title="Data Sync">
          <Row label="Sync files/records">
            <Toggle checked={syncFiles} onChange={setSyncFiles} />
          </Row>
          <Row label="Sync metadata only">
            <Toggle checked={syncMetadata} onChange={setSyncMetadata} />
          </Row>
        </Section>
        <Section title="Scope">
          <Row label="Limit to Sales team spaces">
            <Toggle checked={limitToTeam} onChange={setLimitToTeam} />
          </Row>
        </Section>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <button 
          onClick={save} 
          className="h-12 w-full rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-lg"
        >
          Save Configuration
        </button>
      </div>
    </div>
  )
}



function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold text-gray-700">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Switch checked={checked} onChange={onChange} className={`${checked ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-5 w-10 items-center rounded-full`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </Switch>
  )
}




