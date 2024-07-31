

const registerCanvas = (tag, { mobilePoints, desktopPoints, scrollStart, scrollEnd }) => {
  const canvasWrapper = document.querySelector(tag)
  const img = canvasWrapper.querySelector('img')

  const getCurrentCanvas = () => canvasWrapper.querySelector('canvas')
  const getMode = () => window.innerWidth > window.innerHeight ? 'desktop' : 'mobile'
  const applySigmoidFunction = (x, slope) => {
    return 1 / (1 + Math.exp(-2 * slope * x + slope))
  }

  const interpolate = (start, end, x) => {
    // Pode mudar os valores pra slope pra tu ver como fica melhor
    // Menos de 5 não recomendo
    const interpoX = applySigmoidFunction(x, 5)
    const interpoY = applySigmoidFunction(x, 8)
    return [
      start[0] * (1 - interpoX) + end[0] * interpoX,
      start[1] * (1 - interpoY) + end[1] * interpoY
    ]
  }

  let prevScroll = 0
  let prevPoint = undefined
  let prevMode = undefined

  new MutationObserver(() => {
    const prev = getCurrentCanvas()
    const mode = getMode()
    const sameMode = !prevMode || prevMode === mode

    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    const rect = img.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    canvas.style.top = '50%'
    canvas.style.left = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'

    if (prev && sameMode) {
      canvas.getContext('2d').drawImage(prev, 0, 0, canvas.width, canvas.height)
      canvasWrapper.removeChild(prev)
    } else if (!sameMode) {
      window.scrollTo(window.scrollX, scrollStart)
    }

    canvasWrapper.appendChild(canvas)
    prevMode = mode
  }).observe(img, { attributes: true, attributeFilter: ['style'] })

  const scroll = (scrollY) => {
    const canvas = getCurrentCanvas()
    const points = getMode() === 'desktop' ? desktopPoints : mobilePoints

    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pointsLength = points.length - 1

    const scrollPercent = (scrollY - scrollStart) / (scrollEnd - scrollStart)
    if (scrollPercent < -1)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (scrollPercent < 0)
      return
    if (scrollPercent >= 1)
      return

    const item = Math.floor(scrollPercent * pointsLength)
    const currPercent = points[item]
    const nextPercent = points[item + 1]

    const curr = [currPercent[0] * canvas.width / 100, currPercent[1] * canvas.height / 100]
    const next = [nextPercent[0] * canvas.width / 100, nextPercent[1] * canvas.height / 100]

    const localPercent = (scrollPercent - item / pointsLength) * pointsLength

    // Também pode mudar a cor,a primeira é a de desenho, a segunda é pra apagar
    ctx.globalCompositeOperation = scrollPercent > prevScroll ? 'source-over' : 'destination-out';
    ctx.strokeStyle = scrollPercent > prevScroll ? 'white' : 'white'
    ctx.lineWidth = 5

    ctx.beginPath()
    if (prevPoint)
      ctx.moveTo(prevPoint[0], prevPoint[1])

    const nextPoint = interpolate(curr, next, localPercent)
    ctx.lineTo(nextPoint[0], nextPoint[1])
    ctx.stroke()
    ctx.closePath()

    prevScroll = scrollPercent
    prevPoint = nextPoint
  }

  let prevScrollY = 0
  window.addEventListener('scroll', (e) => {
    const maxScroll = 10
    const iterations = Math.ceil(window.scrollY / maxScroll)
    for (let i = 0; i < iterations; i++) {
      scroll(prevScrollY + (window.scrollY - prevScrollY) * (i / iterations))
    }
    prevScrollY = window.scrollY
  })
}

registerCanvas('.b ', {
  // Coloque pontos dentro de um canvas, em porcentagens
  mobilePoints: [[0, 0], [15, 15], [6, 20], [45, 30], [90, 60]],
  // Coloque pontos dentro de um canvas, em porcentagens
  desktopPoints: [[0, 0], [10, 10], [50, 20], [40, 30],],

  //  desktopPoints: [[0, 0], [15, 15], [6, 20], [45, 30], [90, 60]],
  // Quando o efeito começa, em pixels da barra de scroll
  scrollStart: 3300,
  // Quando o evento termina, em pixels da barra de scroll
  scrollEnd: 7000,
})

gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger.defaults({
//     markers: true
// });

// ScrollTrigger.create({
//   id: "b",


// })
gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger.defaults({
//     markers: true
// });

// ScrollTrigger.create({
//   id: "b",


// })
gsap.to(".b img", {
  ease: "none",
  scale: 1,
  duration: 5,
  scrollTrigger: {
    markers: true,
    scrub: 2,
    trigger: ".home-site",
    start: "center",
    end: "bottom",
    toggleActions: "Restart reverse pause pause",
    id: "b1"
  }

})

gsap.to(".b", {
  ease: "none",
  scale: 1,
  duration: 5,
  scrollTrigger: {
    markers: true,
    scrub: 2,
    trigger: ".b",
    start: "top",
    pin: true,
    end: "bottom 1px",
    endTrigger: ".c",
    toggleActions: "Restart reverse pause pause",
    id: "b2"
  }



})

gsap.to(".texto-autor p", {
  ease: "none",
  scrollTrigger: {
    markers: true,
    scrub: true,
    trigger: ".social-class",
    start: "top",
    pin: true,
    end: "bottom 1px",
    endTrigger: ".social-class",
    toggleActions: "Restart reverse pause pause",
    id: "b7"
  }
})

ScrollTrigger.create({
  trigger: ".texto-autor p", // Elemento que vai disparar a animação
  start: "center bottom", // Define o ponto de gatilho, "center bottom" indica que a animação inicia quando o centro do elemento atinge a parte inferior da janela do navegador
  onEnter: () => {
    if (scrollingDown) {
      document.querySelector(".texto-autor p").classList.add("ativo");
    } else {
      document.querySelector(".texto-autor p").classList.remove("ativo");
    }
  },
  once: true, // A animação só ocorrerá uma vez
});



// gsap.to(".c",{
//  ease: "none",
//   scale:2,
//   duration: 5,
//   scrollTrigger: {
//       trigger: ".b",
//    start: "top", 
//   end: "bottom 150px",
//    pin: "#testo1",
//    id: "orange"
//   }

// })



document.addEventListener('DOMContentLoaded', () => {
  let sections = document.querySelectorAll('section');
  let navLinks = document.querySelectorAll('header nav a');

  window.onscroll = () => {
      sections.forEach(sec => {
          let top = window.scrollY;
          let offset = sec.offsetTop - 150;
          let height = sec.offsetHeight;
          let id = sec.getAttribute('id');

          if (top >= offset && top < (offset + height)) {
              navLinks.forEach(links => {
                  links.classList.remove('ativa');
              });
              document.querySelector('header nav a[href*=' + id + ']').classList.add('ativa');
          }
      });
  };
});



