import nextConfig from '../next.config'

test('allows the local network host to load Next development assets', () => {
  expect(nextConfig.allowedDevOrigins).toContain('192.168.3.71')
})
