links = [
  { name: 'Cloudflare', url: 'https://www.cloudflare.com' },
  { name: 'Computerphile', url: 'https://twitter.com/computer_phile?lang=en' },
  { name: 'Library of Babel', url: 'https://www.libraryofbabel.info' },
  { name: 'Stack Overflow', url: 'https://www.stackoverflow.com' },
  { name: 'HackerTyper', url: 'https://hackertyper.net' },
]

class DivTransformer {
  constructor(id) {
    this.id = id
  }

  element = async element => {
    if (this.id === 'links') {
      for (let link of links) {
        element.append(`<a href=\"${link.url}\">${link.name}</a>`, {
          html: true,
        })
      }
    } else if (this.id === 'profile') {
      element.removeAttribute('style')
      element.setInnerContent(
        `<img class="w-24 h-24 rounded-full shadow-md" id="avatar" 
      src=\"https://avatars3.githubusercontent.com/u/52229249?s=400&u=305c10d1d8a60b1f821692368c4e137cad40f528&v=4\">
      <h1 class="text-md text-white mt-2 font-semibold" id="name">Mahan Mahtabfar</h1>`,
        { html: true },
      )
    } else if (this.id === 'social') {
      element.removeAttribute('style')

      element.append(
        `<a href="https://github.com/mmahtabfar1">
        <svg><img src=\"https://simpleicons.org/icons/github.svg\"></svg>
        </a>`,
        { html: true },
      )
    }
  }
}

//function to send back the links array in json format
const sendLinks = async request => {
  return new Response(JSON.stringify(links), {
    headers: { 'content-type': 'application/json' },
  })
}

//function to send back static page
const sendStaticPage = async request => {
  const staticPage = await fetch(
    'https://static-links-page.signalnerve.workers.dev',
  )

  return myReWriter.transform(staticPage)
}

const handleRequest = async request => {
  let response
  let urlarr = request.url.split('/')

  if (urlarr[urlarr.length - 1] === 'links') {
    response = sendLinks(request)
  } else {
    response = sendStaticPage(request)
  }

  return response
}

const myReWriter = new HTMLRewriter()
  .on('div#links', new DivTransformer('links'))
  .on('div#profile', new DivTransformer('profile'))
  .on('div#social', new DivTransformer('social'))
  .on('title', {
    element(element) {
      element.setInnerContent('Mahan Mahtabfar')
    },
  })
  .on('body', {
    element(element) {
      element.setAttribute('class', 'bg-blue-500')
    },
  })

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
