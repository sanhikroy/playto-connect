import { render, screen } from '@testing-library/react'
import LazyImage from './LazyImage'
import { generatePlaceholder } from '@/lib/image-optimization'

// Mock the image optimization utility
jest.mock('@/lib/image-optimization', () => ({
  generatePlaceholder: jest.fn().mockReturnValue('data:image/svg+xml;base64,placeholder'),
}))

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

describe('LazyImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test Image',
    width: 300,
    height: 200,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders a placeholder initially', () => {
    render(<LazyImage {...defaultProps} />)
    
    // Should generate a placeholder
    expect(generatePlaceholder).toHaveBeenCalledWith(300, 200)
    
    // Should create an IntersectionObserver
    expect(mockIntersectionObserver).toHaveBeenCalled()
    
    // The actual image should not be visible yet (opacity-0)
    const image = screen.queryByRole('img')
    expect(image).not.toBeInTheDocument()
  })

  it('renders the image with priority', () => {
    render(<LazyImage {...defaultProps} priority />)
    
    // Should still generate a placeholder
    expect(generatePlaceholder).toHaveBeenCalledWith(300, 200)
    
    // Should not create an IntersectionObserver for priority images
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(0)
    
    // The image should be loaded immediately with priority images
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src')
    expect(image).toHaveAttribute('alt', 'Test Image')
  })

  it('applies the correct object-fit class', () => {
    render(<LazyImage {...defaultProps} objectFit="contain" priority />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveClass('object-contain')
  })

  it('passes className to the wrapper', () => {
    render(<LazyImage {...defaultProps} className="custom-class" priority />)
    
    // The wrapper div should have the custom class
    const wrapper = screen.getByTestId(`lazy-image-${defaultProps.src.replace(/[^a-zA-Z0-9]/g, '-')}`)
    expect(wrapper).toHaveClass('custom-class')
  })
}) 