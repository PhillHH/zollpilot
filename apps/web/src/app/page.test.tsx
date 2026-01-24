import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('ZollPilot')
  })

  it('renders the welcome message', () => {
    render(<Home />)
    expect(screen.getByText(/Structured customs data management/i)).toBeInTheDocument()
  })

  it('renders navigation link to admin', () => {
    render(<Home />)
    const adminLink = screen.getByRole('link', { name: /admin/i })
    expect(adminLink).toHaveAttribute('href', '/admin')
  })
})
