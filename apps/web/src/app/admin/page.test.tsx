import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AdminPage from './page'

describe('Admin Page', () => {
  it('renders the admin heading', () => {
    render(<AdminPage />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Admin')
  })

  it('renders the coming soon message', () => {
    render(<AdminPage />)
    expect(screen.getByText(/coming in Phase 2/i)).toBeInTheDocument()
  })

  it('renders navigation link to home', () => {
    render(<AdminPage />)
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
