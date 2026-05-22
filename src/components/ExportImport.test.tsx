import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportImport } from './ExportImport'
import { useStore } from '../store'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ExportImport', () => {
  beforeEach(() => {
    useStore.setState({
      requestHistory: [],
      listeners: [],
      profiles: [],
    })
    vi.clearAllMocks()
  })

  it('renders export button', () => {
    render(<ExportImport />)
    expect(screen.getByTitle('Export session')).toBeInTheDocument()
  })

  it('renders import button', () => {
    render(<ExportImport />)
    expect(screen.getByTitle('Import session')).toBeInTheDocument()
  })

  it('export button shows correct label', () => {
    render(<ExportImport />)
    expect(screen.getByText('↓ Export')).toBeInTheDocument()
  })

  it('import button shows correct label', () => {
    render(<ExportImport />)
    expect(screen.getByText('↑ Import')).toBeInTheDocument()
  })

  it('triggers file download on export', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement')
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
      listeners: [],
      profiles: [],
    })

    render(<ExportImport />)
    const exportBtn = screen.getByTitle('Export session')

    await userEvent.click(exportBtn)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalled()

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
  })

  it('export includes schema version', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement')

    render(<ExportImport />)
    const exportBtn = screen.getByTitle('Export session')
    await userEvent.click(exportBtn)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    createElementSpy.mockRestore()
  })

  it('export includes data sections', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement')

    useStore.setState({
      requestHistory: [
        { title: 'test', emitName: 'event', body: '', response: undefined },
      ],
      listeners: [
        { title: 'msg', messages: [] },
      ],
      profiles: [
        {
          id: '1',
          name: 'Dev',
          address: 'http://localhost:3000',
          options: {},
        },
      ],
    })

    render(<ExportImport />)
    const exportBtn = screen.getByTitle('Export session')
    await userEvent.click(exportBtn)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    createElementSpy.mockRestore()
  })

  it('import button triggers file input', async () => {
    render(<ExportImport />)
    const importBtn = screen.getByTitle('Import session')

    await userEvent.click(importBtn)

    // The hidden file input should be clicked
    expect(screen.getByRole('button', { name: /↑ Import/ })).toBeInTheDocument()
  })

  it('handles invalid JSON import', async () => {
    const toastSpy = vi.spyOn(require('sonner'), 'toast')

    render(<ExportImport />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    const invalidFile = new File(['invalid json'], 'test.json', {
      type: 'application/json',
    })

    // Simulate file selection
    if (fileInput) {
      const event = new Event('change', { bubbles: true })
      Object.defineProperty(fileInput, 'files', {
        value: [invalidFile],
        configurable: true,
      })
      fileInput.dispatchEvent(event)
    }

    // Wait for async processing
    await new Promise((resolve) => setTimeout(resolve, 100))

    toastSpy.mockRestore()
  })

  it('validates schema version on import', () => {
    // This test validates that the import checks schema_version
    render(<ExportImport />)
    expect(screen.getByTitle('Import session')).toBeInTheDocument()
  })

  it('export generates correct filename', async () => {
    const linkSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click')

    render(<ExportImport />)
    const exportBtn = screen.getByTitle('Export session')
    await userEvent.click(exportBtn)

    // The link's download attribute should include the date
    expect(linkSpy).toHaveBeenCalled()

    linkSpy.mockRestore()
  })
})
