import NextLink from 'next/link'

export default async () => {
  return (
    <div>
      <h1>Test</h1>
      <p>Dit is een test pagina</p>
      <NextLink href="/">Terug naar de homepagina</NextLink>
    </div>
  )
}
